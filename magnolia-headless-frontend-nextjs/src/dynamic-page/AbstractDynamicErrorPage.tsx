'use client';

import { ReactNode } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { ErrorStatic } from '../templates/pages/_error-static/ErrorStatic.tsx';
import { AbstractDynamicPage } from './AbstractDynamicPage.tsx';
import { Logger } from '../helper/Logger.ts';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import type { FrontendApiEndpointsProvider, HeadlessConfigProviderI } from '../config/ConfigProvider.ts';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';

export abstract class AbstractDynamicErrorPage extends AbstractDynamicPage {
	private readonly frontendApisProvider: FrontendApiEndpointsProvider;

	protected constructor(
		componentMappingsProvider: ComponentMappingsProviderI,
		configProvider: HeadlessConfigProviderI,
		StylesheetProviderI: StylesheetProviderI,
		logger: Logger,
		private readonly restClient: RestClient,
		protected readonly magnoliaContextProvider: MagnoliaContextProvider,
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, logger);
		this.frontendApisProvider = configProvider.get().frontendApisProvider;
	}

	protected async renderDynamic(currentUrl: URL, errorType: ErrorType): Promise<ReactNode> {
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(currentUrl);
		const content = await this.fetchErrorPageContent(magnoliaContext.currentLanguage, errorType);
		return super.renderBase(magnoliaContext, content, {});
	}

	protected renderStatic(language: string, errorType: ErrorType): ReactNode {
		return ErrorStatic({ language: language, errorType: errorType });
	}

	private async fetchErrorPageContent(language: string, errorType: ErrorType) {
		const queryParams = new URLSearchParams();
		queryParams.append('errorType', errorType);
		const errorPageUrl = this.frontendApisProvider.errorPage(language) + '?' + queryParams.toString();
		return fetch(errorPageUrl).then((response) => this.restClient.getJson(errorPageUrl, response));
	}
}
