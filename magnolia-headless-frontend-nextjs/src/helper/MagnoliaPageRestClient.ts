import { IMagnoliaContext, MgnlContent, MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import { RestClient } from './RestClient.ts';
import { MagnoliaContextProvider } from './MagnoliaContextProvider.ts';
import MetaProps from './MetaProps.ts';
import { inject, injectable } from 'tsyringe';
import { type HeadlessConfigProviderI, MagnoliaApiEndpointsProvider, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';

export interface Content extends MgnlContent {
	meta: MetaProps;
	theme?: string;
}

export enum ErrorType {
	PAGE_NOT_FOUND = '404',
	INTERNAL_SERVER_ERROR = '500',
}

@injectable()
export class MagnoliaPageRestClient {
	private readonly apisProvider: MagnoliaApiEndpointsProvider;

	constructor(
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) readonly configProvider: HeadlessConfigProviderI,
		@inject(MagnoliaContextProvider) private readonly magnoliaContextProvider: MagnoliaContextProvider,
		@inject(RestClient) private readonly restClient: RestClient,
	) {
		this.apisProvider = configProvider.get().magnoliaApisProvider;
	}

	public async getErrorPageContent(url: URL, errorType: ErrorType): Promise<Content> {
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(url);
		const queryParams = new URLSearchParams();
		queryParams.set('errorCode', errorType.toString());
		queryParams.set('domain', url.hostname);
		const errorPagesApiUrl = this.apisProvider.errorPageContent(magnoliaContext.currentLanguage) + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(errorPagesApiUrl).then((response) => this.restClient.getJson(errorPagesApiUrl, response));
	}

	public async getPageContent(url: URL): Promise<Content> {
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(url);
		const queryParams = new URLSearchParams(magnoliaContext.searchParams);
		queryParams.delete('jwt');
		queryParams.set('isMagnoliaEdit', magnoliaContext.isMagnoliaEdit.toString());
		queryParams.set('path', magnoliaContext.nodePath);
		queryParams.set('domain', url.hostname);
		if (magnoliaContext.isMagnoliaPreview) {
			queryParams.set('mgnlPreview', true.toString());
		}
		if (magnoliaContext.version) {
			queryParams.set('version', magnoliaContext.version);
		}
		const pagesApiUrl = this.apisProvider.pageContent(magnoliaContext.currentLanguage) + '?' + queryParams.toString();
		return this.restClient.fetchMagnoliaBasicAuth(pagesApiUrl).then((response) => this.restClient.getJson(pagesApiUrl, response));
	}

	public async getTemplateAnnotations(url: URL, path: string): Promise<MgnlTemplateAnnotations> {
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(url);
		if (magnoliaContext.isMagnolia) {
			const queryParams = new URLSearchParams();
			queryParams.set('path', path);
			this.copyFromPageRequest(queryParams, 'workspace', magnoliaContext);
			queryParams.set('domain', url.hostname);
			const annotationsApiUrl = this.apisProvider.annotationTemplates() + '?' + queryParams.toString();
			return await this.restClient
				.fetchMagnoliaBasicAuth(annotationsApiUrl, { jwt: magnoliaContext.searchParams['jwt'] })
				.then((response) => this.restClient.getJson(annotationsApiUrl, response));
		}
		return {};
	}

	private copyFromPageRequest(queryParams: URLSearchParams, name: string, magnoliaContext: IMagnoliaContext) {
		const pageRequestQueryParams = new URLSearchParams(magnoliaContext.searchParams);
		if (pageRequestQueryParams.get(name)) {
			queryParams.set(name, pageRequestQueryParams.get(name));
		}
	}
}
