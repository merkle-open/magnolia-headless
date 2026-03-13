import { createBasicAuthHeader } from './BasicAuth.ts';
import { inject, injectable } from 'tsyringe';
import { Credentials, type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';

@injectable()
export class RestClient {
	private readonly magnoliaCredentials: Credentials;

	constructor(@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) readonly configProvider: HeadlessConfigProviderI) {
		this.magnoliaCredentials = configProvider.get().magnoliaCredentials;
	}

	public async fetchMagnoliaBasicAuth(url: string, additionalHeaders?: any): Promise<Response> {
		const headers = new Headers();
		headers.set('Authorization', createBasicAuthHeader(this.magnoliaCredentials.username, this.magnoliaCredentials.password));
		for (const header in additionalHeaders) {
			headers.set(header, additionalHeaders[header]);
		}
		return await fetch(url, { headers: headers });
	}

	public async getJson(url: string, response: Response): Promise<any> {
		if (response.status === 200 && response.headers.get('content-type').startsWith('application/json')) {
			return response.json();
		}
		if (response.status === 404) {
			return Promise.resolve();
		}
		throw await this.createError('json', url, response);
	}

	public async getText(url: string, response: Response, contentType = 'text/plain'): Promise<any> {
		if (response.status === 200 && response.headers.get('content-type').startsWith(contentType)) {
			return response.text();
		}
		if (response.status === 404) {
			return Promise.resolve();
		}
		throw await this.createError('text', url, response);
	}

	private async createError(type: string, url: string, response: Response): Promise<Error> {
		return new Error(
			`Failed to fetch ${type} - request: ${url} response statusCode: ${response.status} contentType: ${response.headers.get('content-type')} body: ${await response.text()}`,
		);
	}
}
