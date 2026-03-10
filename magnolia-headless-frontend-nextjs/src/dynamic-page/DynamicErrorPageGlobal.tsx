import { ReactNode, useEffect, useState } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { inject, injectable } from 'tsyringe';
import { DynamicPageLayout } from './DynamicPageLayout.tsx';
import { AbstractDynamicErrorPage } from './AbstractDynamicErrorPage.tsx';
import type { HeadlessConfigProviderI } from '../config/ConfigProvider.ts';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import { Logger } from '../helper/Logger.ts';

import { TOKEN_PREFIX } from '../Constants.ts';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';

@injectable()
export class DynamicErrorPageGlobal extends AbstractDynamicErrorPage {
	constructor(
		@inject(TOKEN_PREFIX + 'CombinedComponentMappingsProvider') componentMappingsProvider: ComponentMappingsProviderI,
		@inject(TOKEN_PREFIX + 'HeadlessConfigProviderI') configProvider: HeadlessConfigProviderI,
		@inject(TOKEN_PREFIX + 'StylesheetProviderI') StylesheetProviderI: StylesheetProviderI,
		@inject(TOKEN_PREFIX + 'Logger') logger: Logger,
		@inject(TOKEN_PREFIX + 'RestClient') restClient: RestClient,
		@inject(TOKEN_PREFIX + 'StaticErrorPage') staticErrorPage: StaticErrorPage,
		@inject(TOKEN_PREFIX + 'MagnoliaContextProvider') magnoliaContextProvider: MagnoliaContextProvider,
		@inject(TOKEN_PREFIX + 'DynamicPageLayout') private readonly dynamicPageLayout: DynamicPageLayout,
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, logger, restClient, staticErrorPage, magnoliaContextProvider);
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
			return (
				<html>
					<body>
						<div>Loading...</div>
					</body>
				</html>
			);
		}
		return errorPage;
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
