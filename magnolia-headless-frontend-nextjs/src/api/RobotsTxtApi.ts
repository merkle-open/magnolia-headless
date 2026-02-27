import { RestClient } from '../helper/RestClient.ts';
import { NextRequest } from 'next/server';
import { inject, injectable } from 'tsyringe';
import type { HeadlessConfigProviderI, MagnoliaApiEndpointsProvider } from '../config/ConfigProvider.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

@injectable()
export class RobotsTxtApi {
	private readonly apisProvider: MagnoliaApiEndpointsProvider;

	constructor(
		@inject(TOKEN_PREFIX + 'HeadlessConfigProviderI') configProvider: HeadlessConfigProviderI,
		@inject(TOKEN_PREFIX + 'RestClient') private restClient: RestClient,
	) {
		this.apisProvider = configProvider.get().magnoliaApisProvider;
	}

	public async get(req: NextRequest, sitemapUrlTemplate: string): Promise<Response> {
		const domain: string = new URL('https://' + req.headers.get('host')).hostname; //strip port
		const headers = new Headers();
		headers.set('Content-Type', 'text/plain');
		return this.getRobots(domain, sitemapUrlTemplate).then((robots) => new Response(robots, { headers: headers }));
	}

	private async getRobots(domain: string, sitemapUrlTemplate: string): Promise<string> {
		const queryParams = new URLSearchParams();
		queryParams.set('domain', domain);
		queryParams.set('sitemapUrlTemplate', sitemapUrlTemplate);
		const url = this.apisProvider.robots() + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(url).then((response) => this.restClient.getText(url, response));
	}
}
