// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest, NextResponse } from 'next/server';
import { AbstractMiddleware, MiddlewareNextResponse, MiddlewareResult } from '../Middleware.ts';
import { BrowserLanguageProvider } from '../../helper/BrowserLanguageProvider.ts';
import { inject, injectable } from 'tsyringe';

@injectable()
export class I18nRedirectMiddleware extends AbstractMiddleware {
	constructor(@inject(BrowserLanguageProvider) private browserLanguageProvider: BrowserLanguageProvider) {
		super();
	}

	public getOrder(): number {
		return 100;
	}
	public getName(): string {
		return 'i18nRedirect';
	}

	public async apply(req: NextRequest, res: MiddlewareNextResponse): Promise<MiddlewareResult> {
		if (req.nextUrl.pathname === '/') {
			// browser language redirect
			const language = this.browserLanguageProvider.getBrowserLanguage(req);
			return Promise.resolve({
				response: NextResponse.redirect(new URL(`/${language}${req.nextUrl.search}`, req.url)),
				break: true,
			});
		}
		return Promise.resolve({ response: res });
	}
}
