// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { RestClient } from '../../helper/RestClient.ts';
import { AbstractMiddleware } from '../Middleware.ts';
import { BrowserLanguageProvider } from '../../helper/BrowserLanguageProvider.ts';
import { inject, injectable } from 'tsyringe';
import { type HeadlessConfigProviderI, MagnoliaApiEndpointsProvider, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../../config/ConfigProvider.ts';

export enum RedirectType {
	TEMPORARY = 'redirect',
	PERMANENT = 'permanent',
	FORWARD = 'forward',
}

interface Vanity {
	destination: string;
	type: RedirectType;
	disableCache: boolean;
	carryOverQueryParams: boolean;
}

@injectable()
export class VanityMiddleware extends AbstractMiddleware {
	private apisProvider: MagnoliaApiEndpointsProvider;

	constructor(
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(RestClient) private restClient: RestClient,
		@inject(BrowserLanguageProvider) private browserLanguageProvider: BrowserLanguageProvider,
	) {
		super();
		this.apisProvider = configProvider.get().magnoliaApisProvider;
	}

	public getOrder(): number {
		return 200;
	}
	public getName(): string {
		return 'Vanity';
	}

	public async apply(req: NextRequest): Promise<NextMiddlewareResult> {
		if (super.isPagePathRequest(req)) {
			const url = new URL('https://' + req.headers.get('host'));
			const domain: string = url.hostname; //strip port
			const path = req.nextUrl.pathname;
			const language: string = this.browserLanguageProvider.getBrowserLanguage(req);
			const vanity = await this.getVanity(domain, path, language);
			if (vanity) {
				const headers = new Headers();
				if (vanity.disableCache) {
					headers.set('Cache-Control', 'no-cache');
					headers.set('Pragma', 'no-cache');
				}
				const init: globalThis.ResponseInit = {
					headers: headers,
				};
				const destination = this.getDestination(vanity, req);
				switch (vanity.type) {
					case RedirectType.FORWARD:
						/*
						 * currently ignores NODE_TLS_REJECT_UNAUTHORIZED=0 flag, so external destinations (assets) don't work for local development with tomcat
						 * - https://github.com/vercel/next.js/discussions/49546
						 * - https://github.com/vercel/next.js/pull/78566
						 */
						return NextResponse.rewrite(destination, {
							...init,
							status: 303,
						});
					case RedirectType.TEMPORARY:
						return NextResponse.redirect(destination, {
							...init,
							status: 307,
						});
					case RedirectType.PERMANENT:
						return NextResponse.redirect(destination, {
							...init,
							status: 308,
						});
				}
			}
		}
	}

	private getDestination(vanity: Vanity, req: NextRequest): URL {
		const isAbsolute = vanity.destination?.startsWith('https://');
		const url = new URL(vanity.destination, isAbsolute ? undefined : req.nextUrl);
		if (vanity.carryOverQueryParams) {
			req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
		}
		return url;
	}

	private async getVanity(domain: string, path: string, language: string): Promise<Vanity> {
		const queryParams = new URLSearchParams();
		queryParams.set('domain', domain);
		queryParams.set('path', path);
		const url = this.apisProvider.vanity(language) + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(url).then((response) => this.restClient.getJson(url, response));
	}
}
