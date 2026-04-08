// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest } from 'next/server';
import { RestClient } from '../../helper/RestClient.ts';
import { AbstractMiddleware, MiddlewareNextResponse, MiddlewareResult } from '../Middleware.ts';
import { inject, injectable } from 'tsyringe';
import { type HeadlessConfigProviderI, MagnoliaApiEndpointsProvider, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../../config/ConfigProvider.ts';

enum Target {
	REQUEST = 'REQUEST',
	RESPONSE = 'RESPONSE',
	BOTH = 'BOTH',
}
interface HeaderValue {
	value: string;
	target: Target;
}

@injectable()
export class DynamicHeaderMiddleware extends AbstractMiddleware {
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
		return 'DynamicHeader';
	}

	public async apply(req: NextRequest, res: MiddlewareNextResponse): Promise<MiddlewareResult> {
		if (super.isPagePathRequest(req)) {
			const domain: string = new URL('https://' + req.headers.get('host')).hostname; //strip port
			const header = await this.getHeader(domain);
			for (const key in header) {
				const { value, target }: HeaderValue = header[key];
				if (target == Target.RESPONSE || target == Target.BOTH) {
					res.headers.set(key, value);
				}
				if (target == Target.REQUEST || target == Target.BOTH) {
					res.requestHeaders.set(key, value);
				}
			}
		}
		return Promise.resolve({ response: res });
	}

	private async getHeader(domain: string): Promise<Map<string, HeaderValue>> {
		const queryParams = new URLSearchParams();
		queryParams.set('domain', domain);
		const url = this.apisProvider.dynamicHeader() + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(url).then((response) => this.restClient.getJson(url, response));
	}
}
