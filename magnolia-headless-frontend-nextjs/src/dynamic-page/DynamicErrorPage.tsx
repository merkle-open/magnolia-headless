'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { inject, injectable } from 'tsyringe';
import { Logger } from '../helper/Logger.ts';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import { type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';
import { AbstractDynamicErrorPage } from './AbstractDynamicErrorPage.tsx';

import { type StylesheetProviderI, STYLESHEET_PROVIDER_TOKEN } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';
import { CombinedComponentMappingsProvider } from '../templates/ComponentMappingsProvider.ts';

@injectable()
export class DynamicErrorPage extends AbstractDynamicErrorPage {
	constructor(
		@inject(CombinedComponentMappingsProvider) componentMappingsProvider: ComponentMappingsProviderI,
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(STYLESHEET_PROVIDER_TOKEN) StylesheetProviderI: StylesheetProviderI,
		@inject(Logger) logger: Logger,
		@inject(RestClient) restClient: RestClient,
		@inject(StaticErrorPage) staticErrorPage: StaticErrorPage,
		@inject(MagnoliaContextProvider) magnoliaContextProvider: MagnoliaContextProvider,
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, logger, restClient, staticErrorPage, magnoliaContextProvider);
	}

	public async render(errorType: ErrorType): Promise<ReactNode> {
		const [errorPage, setErrorPage] = useState(null);

		useEffect(() => {
			const currentUrl = new URL(window.location.href);
			super
				.renderDynamic(currentUrl, errorType)
				.then((content) => setErrorPage(content))
				.catch(() => setErrorPage(super.renderStatic(this.getLanguage(currentUrl), errorType)));
		}, []);

		if (!errorPage) {
			return <div>Loading...</div>;
		}
		return errorPage;
	}

	private getLanguage(url: URL): string {
		try {
			return this.magnoliaContextProvider.getMagnoliaContext(url).currentLanguage;
		} catch {
			return '';
		}
	}
}
