'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { inject, injectable } from 'tsyringe';
import { DynamicPageLayout } from './DynamicPageLayout.tsx';
import { AbstractDynamicErrorPage, ErrorPageLoader } from './AbstractDynamicErrorPage.tsx';
import { type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';

import { type StylesheetProviderI, STYLESHEET_PROVIDER_TOKEN } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';
import { CombinedComponentMappingsProvider } from '../templates/ComponentMappingsProvider.ts';
import { ThemeValidator } from '../helper/ThemeValidator.ts';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';
import { useCspHeaderNonce } from './provider/impl/CspHeaderNonceContext.tsx';

@injectable()
export class DynamicErrorPageGlobal extends AbstractDynamicErrorPage {
	constructor(
		@inject(CombinedComponentMappingsProvider) componentMappingsProvider: ComponentMappingsProviderI,
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(STYLESHEET_PROVIDER_TOKEN) StylesheetProviderI: StylesheetProviderI,
		@inject(ThemeValidator) themeValidator: ThemeValidator,
		@inject(EditablePage) editablePage: EditablePage,
		@inject(RestClient) restClient: RestClient,
		@inject(StaticErrorPage) staticErrorPage: StaticErrorPage,
		@inject(MagnoliaContextProvider) magnoliaContextProvider: MagnoliaContextProvider,
		@inject(DynamicPageLayout) private readonly dynamicPageLayout: DynamicPageLayout,
		@inject(ErrorPageLoader) private readonly errorPageLoader: ErrorPageLoader,
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, themeValidator, editablePage, restClient, staticErrorPage, magnoliaContextProvider);
	}

	public render(errorType: ErrorType): ReactNode {
		const [errorPage, setErrorPage] = useState(null);
		const nonce = useCspHeaderNonce();
		useEffect(() => {
			const language = this.getLanguage();
			this.renderGlobalDynamicError(language, errorType, nonce)
				.then((content) => setErrorPage(content))
				.catch(() => setErrorPage(this.renderGlobalStaticError(language, errorType)));
		}, []);

		if (!errorPage) {
			return this.errorPageLoader.renderGlobal(errorType);
		}
		return errorPage;
	}

	private async renderGlobalDynamicError(language: string, errorType: ErrorType, nonce: string): Promise<ReactNode> {
		try {
			const currentUrl = new URL(window.location.href);
			currentUrl.pathname = language;
			return super.renderDynamic(currentUrl, errorType, nonce).then((errorPage) => this.dynamicPageLayout.render(language, errorPage));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private renderGlobalStaticError(language: string, errorType: ErrorType): ReactNode {
		const errorPage = super.renderStatic(language, errorType);
		return this.dynamicPageLayout.render(language, errorPage);
	}

	private getLanguage(): string {
		return navigator.language.split('-')[0];
	}
}
