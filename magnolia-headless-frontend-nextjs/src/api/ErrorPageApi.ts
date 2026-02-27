import { NextRequest } from 'next/server';
import { inject, injectable } from 'tsyringe';
import { ErrorType, MagnoliaPageRestClient } from '../helper/MagnoliaPageRestClient.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

@injectable()
export class ErrorPageApi {
	constructor(@inject(TOKEN_PREFIX + 'MagnoliaPageRestClient') private magnoliaPageRestClient: MagnoliaPageRestClient) {}

	public async get(req: NextRequest, language: string): Promise<Response> {
		const queryParams = req.nextUrl.searchParams;
		const url = new URL(`https://${req.headers.get('host')}/${language}`);
		const errorType = this.getErrorTypeFromString(queryParams.get('errorType'));
		const headers = new Headers();
		headers.set('Content-Type', 'application/json');
		return this.magnoliaPageRestClient
			.getErrorPageContent(url, errorType)
			.then((content) => JSON.stringify(content))
			.then((body) => new Response(body, { headers: headers }));
	}

	private getErrorTypeFromString(value: string): ErrorType | undefined {
		const directions = Object.values(ErrorType);
		if (directions.includes(value as ErrorType)) {
			return value as ErrorType;
		}
		return undefined;
	}
}
