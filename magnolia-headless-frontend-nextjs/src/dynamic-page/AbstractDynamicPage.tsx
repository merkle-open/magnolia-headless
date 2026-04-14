import { ExtendedMagnoliaContext } from '../helper/MagnoliaContextProvider.ts';
import PageProps from '../templates/pages/BaseProps.ts';
import { MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import React, { ReactNode } from 'react';
import { MagnoliaConfig, RefService } from '@magnolia/react-editor';
import { EditablePage } from '../templates/pages/__magnolia-editable-page/EditablePage.tsx';
import { type StylesheetProviderI } from '../config/StylesheetProvider.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';
import { ThemeValidator } from '../helper/ThemeValidator.ts';

export abstract class AbstractDynamicPage {
	protected constructor(
		private readonly componentMappingsProvider: ComponentMappingsProviderI,
		private readonly StylesheetProviderI: StylesheetProviderI,
		private readonly themeValidator: ThemeValidator,
		private readonly editablePage: EditablePage,
	) {}

	protected async renderBase(magnoliaContext: ExtendedMagnoliaContext, content: PageProps, templateAnnotations: MgnlTemplateAnnotations): Promise<ReactNode> {
		const config: MagnoliaConfig = {
			componentMappings: this.componentMappingsProvider.getComponentMappings(),
		};

		RefService.setMagnoliaContextRef(magnoliaContext);
		global.mgnlInPageEditor = magnoliaContext.isMagnoliaEdit;

		return (
			<div>
				{/* is moved to <head> see https://react.dev/blog/2024/12/05/react-19#support-for-stylesheets */}
				{this.getStylesheet(magnoliaContext, content).map((stylesheet, index) => (
					<link rel="stylesheet" key={`AbstractDynamicPage-stylesheet-${index}`} href={stylesheet} precedence="high" />
				))}
				{await this.editablePage.render({ content, config, templateAnnotations, magnoliaContext })}
			</div>
		);
	}

	private getStylesheet(magnoliaContext: ExtendedMagnoliaContext, content: PageProps): string[] {
		return this.StylesheetProviderI.get(magnoliaContext, this.themeValidator.getValidatedTheme(content.theme));
	}
}
