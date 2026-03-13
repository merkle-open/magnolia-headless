import { NextRequest, NextResponse } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { AbstractMiddleware } from '../Middleware.ts';
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

	public async apply(req: NextRequest): Promise<NextMiddlewareResult> {
		if (req.nextUrl.pathname === '/') {
			// browser language redirect
			const language = this.browserLanguageProvider.getBrowserLanguage(req);
			return NextResponse.redirect(new URL(`/${language}${req.nextUrl.search}`, req.url));
		}
	}
}
