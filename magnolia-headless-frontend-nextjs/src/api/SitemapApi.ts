// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest } from 'next/server';
import { RestClient } from '../helper/RestClient.ts';
import { inject, injectable } from 'tsyringe';
import { type HeadlessConfigProviderI, MagnoliaApiEndpointsProvider, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';

@injectable()
export class SitemapApi {
	private readonly apisProvider: MagnoliaApiEndpointsProvider;

	constructor(
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(RestClient) private restClient: RestClient,
	) {
		this.apisProvider = configProvider.get().magnoliaApisProvider;
	}

	public async get(req: NextRequest, language: string, type: string): Promise<Response> {
		const domain: string = new URL('https://' + req.headers.get('host')).hostname; //strip port
		const headers = new Headers();
		headers.set('Content-Type', 'application/xml');
		return this.getSitemap(domain, language, type).then((sitemap) => new Response(sitemap, { headers: headers }));
	}

	private async getSitemap(domain: string, language: string, type: string): Promise<string> {
		const queryParams = new URLSearchParams();
		queryParams.set('domain', domain);
		queryParams.set('type', type);
		const url = this.apisProvider.sitemap(language) + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(url).then((response) => this.restClient.getText(url, response, 'application/xml'));
	}
}
