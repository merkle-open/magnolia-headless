import { ReactNode } from 'react';
import { ErrorType, MagnoliaPageRestClient } from '../helper/MagnoliaPageRestClient.ts';
import { inject, injectable } from 'tsyringe';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import { AbstractDynamicErrorPage } from './AbstractDynamicErrorPage.tsx';
import { type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';
import { type StylesheetProviderI, STYLESHEET_PROVIDER_TOKEN } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';
import { CombinedComponentMappingsProvider } from '../templates/ComponentMappingsProvider.ts';
import { ThemeValidator } from '../helper/ThemeValidator.ts';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';
import { ContentSecurityPolicyNonceProvider } from '../middleware/impl/ContentSecurityPolicyNonceMiddleware.ts';
import { BrowserLanguageProvider } from '../helper/BrowserLanguageProvider.ts';
import { RestClient } from '../helper/RestClient.ts';

@injectable()
export class DynamicErrorPageServer extends AbstractDynamicErrorPage {
	constructor(
		@inject(CombinedComponentMappingsProvider) componentMappingsProvider: ComponentMappingsProviderI,
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(STYLESHEET_PROVIDER_TOKEN) StylesheetProviderI: StylesheetProviderI,
		@inject(ThemeValidator) themeValidator: ThemeValidator,
		@inject(EditablePage) editablePage: EditablePage,
		@inject(RestClient) restClient: RestClient,
		@inject(StaticErrorPage) staticErrorPage: StaticErrorPage,
		@inject(MagnoliaContextProvider) magnoliaContextProvider: MagnoliaContextProvider,
		@inject(MagnoliaPageRestClient) private readonly magnoliaPageRestClient: MagnoliaPageRestClient,
		@inject(ContentSecurityPolicyNonceProvider) private readonly cspNonceProvider: ContentSecurityPolicyNonceProvider,
		@inject(BrowserLanguageProvider) private readonly browserLanguageProvider: BrowserLanguageProvider,
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, themeValidator, editablePage, restClient, staticErrorPage, magnoliaContextProvider);
	}

	public async render(errorType: ErrorType, currentUrl?: URL | string): Promise<ReactNode> {
		const resolvedUrl = this.resolveUrl(currentUrl) || (await this.getFallbackUrl());
		if (!resolvedUrl) {
			return this.renderStatic(await this.getFallbackLanguage(), errorType);
		}

		try {
			const content = await this.magnoliaPageRestClient.getErrorPageContent(resolvedUrl, errorType);
			const nonce = await this.cspNonceProvider.get();
			return await super.renderErrorPageContent(resolvedUrl, content, nonce);
		} catch {
			return this.renderStatic(this.getLanguage(resolvedUrl), errorType);
		}
	}

	private async getFallbackUrl(): Promise<URL | undefined> {
		try {
			// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
			const headerList = await import('next/headers').then((headers) => headers.headers());
			const host = headerList.get('x-forwarded-host') || headerList.get('host');
			if (!host) {
				return undefined;
			}
			const proto = headerList.get('x-forwarded-proto') || 'https';
			const language = this.browserLanguageProvider.getBrowserLanguage({ headers: headerList });
			return new URL(`/${language}`, `${proto}://${host}`);
		} catch {
			return undefined;
		}
	}

	private resolveUrl(currentUrl?: URL | string): URL | undefined {
		if (currentUrl instanceof URL) {
			return currentUrl;
		}
		if (currentUrl) {
			return new URL(currentUrl);
		}
		return undefined;
	}

	private getLanguage(url: URL): string {
		try {
			return this.magnoliaContextProvider.getMagnoliaContext(url).currentLanguage;
		} catch {
			return '';
		}
	}

	private async getFallbackLanguage(): Promise<string> {
		try {
			// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
			const headerList = await import('next/headers').then((headers) => headers.headers());
			return this.browserLanguageProvider.getBrowserLanguage({ headers: headerList });
		} catch {
			return '';
		}
	}
}
