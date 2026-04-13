// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest } from 'next/server';
import { RestClient } from '../../helper/RestClient.ts';
import { AbstractMiddleware, MiddlewareNextResponse, MiddlewareResult } from '../Middleware.ts';
import { inject, injectable } from 'tsyringe';
import { type HeadlessConfigProviderI, MagnoliaApiEndpointsProvider, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../../config/ConfigProvider.ts';

@injectable()
export class DynamicResponseHeaderMiddleware extends AbstractMiddleware {
	private apisProvider: MagnoliaApiEndpointsProvider;

	constructor(
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(RestClient) private restClient: RestClient,
	) {
		super();
		this.apisProvider = configProvider.get().magnoliaApisProvider;
	}

	public getOrder(): number {
		return 300;
	}
	public getName(): string {
		return 'DynamicResponseHeader';
	}

	public async apply(req: NextRequest, res: MiddlewareNextResponse): Promise<MiddlewareResult> {
		if (super.isPagePathRequest(req)) {
			const domain: string = new URL('https://' + req.headers.get('host')).hostname; //strip port
			const header = await this.getHeader(domain);
			for (const key in header) {
				res.headers.set(key, header[key]);
			}
		}
		return Promise.resolve({ response: res });
	}

	private async getHeader(domain: string): Promise<any> {
		const queryParams = new URLSearchParams();
		queryParams.set('domain', domain);
		const url = this.apisProvider.dynamicResponseHeader() + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(url).then((response) => this.restClient.getJson(url, response));
	}
}
