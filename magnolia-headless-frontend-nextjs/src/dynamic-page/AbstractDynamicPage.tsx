import { ExtendedMagnoliaContext } from '../helper/MagnoliaContextProvider.ts';
import { Content } from '../helper/MagnoliaPageRestClient.ts';
import { MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import React, { ReactNode } from 'react';
import { MagnoliaConfig, RefService } from '@magnolia/react-editor';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';
import { Logger } from '../helper/Logger.ts';
import type { HeadlessConfigProviderI, ThemesProvider } from '../config/ConfigProvider.ts';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';

export abstract class AbstractDynamicPage {
	private themesProvider: ThemesProvider;

	protected constructor(
		private readonly componentMappingsProvider: ComponentMappingsProviderI,
		readonly configProvider: HeadlessConfigProviderI,
		private readonly StylesheetProviderI: StylesheetProviderI,
		private readonly logger: Logger,
	) {
		this.themesProvider = configProvider.get().themesProvider;
	}

	protected renderBase(magnoliaContext: ExtendedMagnoliaContext, content: Content, templateAnnotations: MgnlTemplateAnnotations): ReactNode {
		const config: MagnoliaConfig = {
			componentMappings: this.componentMappingsProvider.getComponentMappings(),
		};

		RefService.setMagnoliaContextRef(magnoliaContext);
		global.mgnlInPageEditor = magnoliaContext.isMagnoliaEdit;

		return (
			<div>
				{/* is moved to <head> see https://react.dev/blog/2024/12/05/react-19#support-for-stylesheets */}
				{this.getStylesheet(magnoliaContext, content).map((stylesheet) => (
					<link rel="stylesheet" href={stylesheet} precedence="high" />
				))}
				<EditablePage content={content} config={config} templateAnnotations={templateAnnotations} magnoliaContext={magnoliaContext} />
			</div>
		);
	}

	private getStylesheet(magnoliaContext: ExtendedMagnoliaContext, content: Content): string[] {
		return this.StylesheetProviderI.get(magnoliaContext, this.getValidatedTheme(content.theme));
	}
	private getValidatedTheme(theme?: string): string {
		if (!theme || !this.themesProvider.getAll().includes(theme)) {
			if (theme) {
				this.logger.error(`Got invalid theme '${theme}' from magnolia! falling back to ${this.themesProvider.getFallback()}`);
			}
			return this.themesProvider.getFallback();
		}
		return theme;
	}
}
