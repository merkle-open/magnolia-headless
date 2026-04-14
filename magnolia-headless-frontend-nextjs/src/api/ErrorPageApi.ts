// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest } from 'next/server';
import { inject, injectable } from 'tsyringe';
import { ErrorType, MagnoliaPageRestClient } from '../helper/MagnoliaPageRestClient.ts';

@injectable()
export class ErrorPageApi {
	constructor(@inject(MagnoliaPageRestClient) private magnoliaPageRestClient: MagnoliaPageRestClient) {}

	public async get(req: NextRequest, language: string): Promise<Response> {
		const queryParams = req.nextUrl.searchParams;
		const url = new URL(`https://${req.headers.get('host')}/${language}`);
		const errorType = this.getErrorTypeFromString(queryParams.get('errorType'));

		return this.magnoliaPageRestClient.getErrorPageContent(url, errorType).then((content) => {
			if (content) {
				const headers = new Headers();
				headers.set('Content-Type', 'application/json');
				return new Response(JSON.stringify(content), { headers: headers });
			}
			return new Response(null, { status: 404 });
		});
	}

	private getErrorTypeFromString(value: string): ErrorType | undefined {
		const directions = Object.values(ErrorType);
		if (directions.includes(value as ErrorType)) {
			return value as ErrorType;
		}
		return undefined;
	}
}
