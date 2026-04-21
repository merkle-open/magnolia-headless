// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import { MagnoliaPageRestClient } from '../helper/MagnoliaPageRestClient.ts';
import { MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import { Metadata } from 'next';
import { MetadataProvider } from '../helper/MetadataProvider.ts';
import { inject, injectable } from 'tsyringe';
import { AbstractDynamicPage } from './AbstractDynamicPage.tsx';
import PageProps, { UrlProvider } from './PageProps.ts';

import { type StylesheetProviderI, STYLESHEET_PROVIDER_TOKEN } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { CombinedComponentMappingsProvider } from '../templates/ComponentMappingsProvider.ts';
import { ThemeValidator } from '../helper/ThemeValidator.ts';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';
import { ContentSecurityPolicyNonceProvider } from '../middleware/impl/ContentSecurityPolicyNonceMiddleware.ts';

@injectable()
export class DynamicPage extends AbstractDynamicPage {
	constructor(
		@inject(CombinedComponentMappingsProvider) componentMappingsProvider: ComponentMappingsProviderI,
		@inject(STYLESHEET_PROVIDER_TOKEN) stylesheetProviderI: StylesheetProviderI,
		@inject(ThemeValidator) themeValidator: ThemeValidator,
		@inject(EditablePage) editablePage: EditablePage,
		@inject(ContentSecurityPolicyNonceProvider) private readonly cspNonceProvider: ContentSecurityPolicyNonceProvider,
		@inject(MagnoliaContextProvider) private readonly magnoliaContextProvider: MagnoliaContextProvider,
		@inject(MagnoliaPageRestClient) private readonly magnoliaPageRestClient: MagnoliaPageRestClient,
		@inject(MetadataProvider) private readonly metadataProvider: MetadataProvider,
		@inject(UrlProvider) private readonly urlProvider: UrlProvider,
	) {
		super(componentMappingsProvider, stylesheetProviderI, themeValidator, editablePage);
	}

	public async render(pageProps: PageProps): Promise<ReactNode> {
		const url = await this.urlProvider.getUrl(pageProps);
		const content = await this.magnoliaPageRestClient.getPageContent(url);
		if (!content) {
			notFound();
		}
		const templateAnnotations: MgnlTemplateAnnotations = await this.magnoliaPageRestClient.getTemplateAnnotations(url, content['@path']);
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(url);
		const nonce = await this.cspNonceProvider.get();
		return super.renderBase(magnoliaContext, content, templateAnnotations, nonce);
	}

	public async generateMetadata(pageProps: PageProps): Promise<Metadata> {
		const url = await this.urlProvider.getUrl(pageProps);
		const content = await this.magnoliaPageRestClient.getPageContent(url);
		const meta = content?.meta;
		return this.metadataProvider.getMetadata(meta);
	}
}
