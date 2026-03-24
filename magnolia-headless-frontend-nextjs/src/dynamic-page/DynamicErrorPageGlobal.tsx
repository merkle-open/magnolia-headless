'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { inject, injectable } from 'tsyringe';
import { DynamicPageLayout } from './DynamicPageLayout.tsx';
import { AbstractDynamicErrorPage } from './AbstractDynamicErrorPage.tsx';
import { type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';

import { type StylesheetProviderI, STYLESHEET_PROVIDER_TOKEN } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';
import { CombinedComponentMappingsProvider } from '../templates/ComponentMappingsProvider.ts';
import { ThemeValidator } from '../helper/ThemeValidator.ts';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';

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
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, themeValidator, editablePage, restClient, staticErrorPage, magnoliaContextProvider);
	}

	public render(errorType: ErrorType): ReactNode {
		const [errorPage, setErrorPage] = useState(null);

		useEffect(() => {
			const language = this.getLanguage();
			this.renderGlobalDynamicError(language, errorType)
				.then((content) => setErrorPage(content))
				.catch(() => setErrorPage(this.renderGlobalStaticError(language, errorType)));
		}, []);

		if (!errorPage) {
			return this.renderLoader(errorType);
		}
		return errorPage;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected renderLoader(errorType: ErrorType): ReactNode {
		return (
			<html>
				<body>
					<div>Loading...</div>
				</body>
			</html>
		);
	}

	private async renderGlobalDynamicError(language: string, errorType: ErrorType): Promise<ReactNode> {
		const currentUrl = new URL(window.location.href);
		currentUrl.pathname = language;
		const errorPage = await super.renderDynamic(currentUrl, errorType);
		return this.dynamicPageLayout.render(language, errorPage);
	}

	private renderGlobalStaticError(language: string, errorType: ErrorType): ReactNode {
		const errorPage = super.renderStatic(language, errorType);
		return this.dynamicPageLayout.render(language, errorPage);
	}

	private getLanguage(): string {
		return navigator.language.split('-')[0];
	}
}
