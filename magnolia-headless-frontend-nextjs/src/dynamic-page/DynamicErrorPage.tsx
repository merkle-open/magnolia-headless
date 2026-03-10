'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { inject, injectable } from 'tsyringe';
import { Logger } from '../helper/Logger.ts';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import type { HeadlessConfigProviderI } from '../config/ConfigProvider.ts';
import { AbstractDynamicErrorPage } from './AbstractDynamicErrorPage.tsx';

import { TOKEN_PREFIX } from '../Constants.ts';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';

@injectable()
export class DynamicErrorPage extends AbstractDynamicErrorPage {
	constructor(
		@inject(TOKEN_PREFIX + 'CombinedComponentMappingsProvider') componentMappingsProvider: ComponentMappingsProviderI,
		@inject(TOKEN_PREFIX + 'HeadlessConfigProviderI') configProvider: HeadlessConfigProviderI,
		@inject(TOKEN_PREFIX + 'StylesheetProviderI') StylesheetProviderI: StylesheetProviderI,
		@inject(TOKEN_PREFIX + 'Logger') logger: Logger,
		@inject(TOKEN_PREFIX + 'RestClient') restClient: RestClient,
		@inject(TOKEN_PREFIX + 'StaticErrorPage') staticErrorPage: StaticErrorPage,
		@inject(TOKEN_PREFIX + 'MagnoliaContextProvider') magnoliaContextProvider: MagnoliaContextProvider,
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
