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
import type { HeadlessConfigProviderI } from '../config/ConfigProvider.ts';
import PageProps, { UrlProvider } from './PageProps.ts';

import { TOKEN_PREFIX } from '../Constants.ts';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';

@injectable()
export class DynamicPage extends AbstractDynamicPage {
	constructor(
		@inject(TOKEN_PREFIX + 'CombinedComponentMappingsProvider') componentMappingsProvider: ComponentMappingsProviderI,
		@inject(TOKEN_PREFIX + 'HeadlessConfigProviderI') configProvider: HeadlessConfigProviderI,
		@inject(TOKEN_PREFIX + 'StylesheetProviderI') StylesheetProviderI: StylesheetProviderI,
		@inject(TOKEN_PREFIX + 'Logger') logger: Logger,
		@inject(TOKEN_PREFIX + 'MagnoliaContextProvider') private readonly magnoliaContextProvider: MagnoliaContextProvider,
		@inject(TOKEN_PREFIX + 'MagnoliaPageRestClient') private readonly magnoliaPageRestClient: MagnoliaPageRestClient,
		@inject(TOKEN_PREFIX + 'MetadataProvider') private readonly metadataProvider: MetadataProvider,
		@inject(TOKEN_PREFIX + 'UrlProvider') private readonly urlProvider: UrlProvider,
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
