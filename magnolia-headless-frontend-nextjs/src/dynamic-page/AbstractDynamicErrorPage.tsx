import { ReactNode } from 'react';
import { ErrorType } from '../helper/MagnoliaPageRestClient.ts';
import { StaticErrorPage } from '../templates/pages/_error-static/ErrorStatic.tsx';
import { AbstractDynamicPage } from './AbstractDynamicPage.tsx';
import { RestClient } from '../helper/RestClient.ts';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import type { FrontendApiEndpointsProvider, HeadlessConfigProviderI } from '../config/ConfigProvider.ts';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { ThemeValidator } from '../helper/ThemeValidator.ts';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';
import { injectable } from 'tsyringe';

export abstract class AbstractDynamicErrorPage extends AbstractDynamicPage {
	private readonly frontendApisProvider: FrontendApiEndpointsProvider;

	protected constructor(
		componentMappingsProvider: ComponentMappingsProviderI,
		configProvider: HeadlessConfigProviderI,
		StylesheetProviderI: StylesheetProviderI,
		themeValidator: ThemeValidator,
		editablePage: EditablePage,
		private readonly restClient: RestClient,
		private readonly staticErrorPage: StaticErrorPage,
		protected readonly magnoliaContextProvider: MagnoliaContextProvider,
	) {
		super(componentMappingsProvider, StylesheetProviderI, themeValidator, editablePage);
		this.frontendApisProvider = configProvider.get().frontendApisProvider;
	}

	protected async renderDynamic(currentUrl: URL, errorType: ErrorType): Promise<ReactNode> {
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(currentUrl);
		const content = await this.fetchErrorPageContent(magnoliaContext.currentLanguage, errorType);
		if (content) {
			return super.renderBase(magnoliaContext, content, {});
		}
		return Promise.reject(new Error('no dynamic error page maintained!'));
	}

	protected renderStatic(language: string, errorType: ErrorType): ReactNode {
		return this.staticErrorPage.render({ language: language, errorType: errorType });
	}

	private async fetchErrorPageContent(language: string, errorType: ErrorType) {
		const queryParams = new URLSearchParams();
		queryParams.append('errorType', errorType);
		const errorPageUrl = this.frontendApisProvider.errorPage(language) + '?' + queryParams.toString();
		return fetch(errorPageUrl).then((response) => this.restClient.getJson(errorPageUrl, response));
	}
}

@injectable()
export class ErrorPageLoader {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public render(errorType: ErrorType): ReactNode {
		return <div>Loading...</div>;
	}

	public renderGlobal(errorType: ErrorType): ReactNode {
		return (
			<html>
				<body>{this.render(errorType)}</body>
			</html>
		);
	}
}
