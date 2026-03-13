import { ReactNode } from 'react';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import { MagnoliaPageRestClient } from '../helper/MagnoliaPageRestClient.ts';
import { notFound } from 'next/navigation';
import { MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import { Metadata } from 'next';
import { MetadataProvider } from '../helper/MetadataProvider.ts';
import { inject, injectable } from 'tsyringe';
import { AbstractDynamicPage } from './AbstractDynamicPage.tsx';
import { Logger } from '../helper/Logger.ts';
import { type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN } from '../config/ConfigProvider.ts';
import PageProps, { UrlProvider } from './PageProps.ts';

import { type StylesheetProviderI, STYLESHEET_PROVIDER_TOKEN } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { CombinedComponentMappingsProvider } from '../templates/ComponentMappingsProvider.ts';

@injectable()
export class DynamicPage extends AbstractDynamicPage {
	constructor(
		@inject(CombinedComponentMappingsProvider) componentMappingsProvider: ComponentMappingsProviderI,
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(STYLESHEET_PROVIDER_TOKEN) StylesheetProviderI: StylesheetProviderI,
		@inject(Logger) logger: Logger,
		@inject(MagnoliaContextProvider) private readonly magnoliaContextProvider: MagnoliaContextProvider,
		@inject(MagnoliaPageRestClient) private readonly magnoliaPageRestClient: MagnoliaPageRestClient,
		@inject(MetadataProvider) private readonly metadataProvider: MetadataProvider,
		@inject(UrlProvider) private readonly urlProvider: UrlProvider,
	) {
		super(componentMappingsProvider, configProvider, StylesheetProviderI, logger);
	}

	public async render(pageProps: PageProps): Promise<ReactNode> {
		const url = await this.urlProvider.getUrl(pageProps);
		const content = await this.magnoliaPageRestClient.getPageContent(url);
		if (!content) {
			notFound();
		}
		const templateAnnotations: MgnlTemplateAnnotations = await this.magnoliaPageRestClient.getTemplateAnnotations(url, content['@path']);
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(url);
		return super.renderBase(magnoliaContext, content, templateAnnotations);
	}

	public async generateMetadata(pageProps: PageProps): Promise<Metadata> {
		const url = await this.urlProvider.getUrl(pageProps);
		const content = await this.magnoliaPageRestClient.getPageContent(url);
		const meta = content?.meta;
		return this.metadataProvider.getMetadata(meta);
	}
}
