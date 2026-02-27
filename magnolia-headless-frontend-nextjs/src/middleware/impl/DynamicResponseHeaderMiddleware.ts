import { NextRequest, NextResponse } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { RestClient } from '../../helper/RestClient.ts';
import { AbstractMiddleware } from '../Middleware.ts';
import { inject, injectable } from 'tsyringe';
import type { HeadlessConfigProviderI, MagnoliaApiEndpointsProvider } from '../../config/ConfigProvider.ts';

import { TOKEN_PREFIX } from '../../Constants.ts';

@injectable()
export class DynamicResponseHeaderMiddleware extends AbstractMiddleware {
	private apisProvider: MagnoliaApiEndpointsProvider;

	constructor(
		@inject(TOKEN_PREFIX + 'HeadlessConfigProviderI') configProvider: HeadlessConfigProviderI,
		@inject(TOKEN_PREFIX + 'RestClient') private restClient: RestClient,
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

	public async apply(req: NextRequest, res: NextResponse): Promise<NextMiddlewareResult> {
		if (super.isPagePathRequest(req)) {
			const domain: string = new URL('https://' + req.headers.get('host')).hostname; //strip port
			const header = await this.getHeader(domain);
			for (const key in header) {
				res.headers.set(key, header[key]);
			}
		}
	}

	private async getHeader(domain: string): Promise<any> {
		const queryParams = new URLSearchParams();
		queryParams.set('domain', domain);
		const url = this.apisProvider.dynamicResponseHeader() + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(url).then((response) => this.restClient.getJson(url, response));
	}
}
