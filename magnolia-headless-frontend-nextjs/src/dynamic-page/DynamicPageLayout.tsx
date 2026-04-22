import React, { ReactNode } from 'react';
import { inject, injectable } from 'tsyringe';
import { MagnoliaContextProvider } from '../helper/MagnoliaContextProvider.ts';
import { UrlProvider, Params } from './PageProps.ts';
import { ComposedContextProvider } from './provider/Provider.tsx';

export interface Props {
	children: ReactNode;
	params: Promise<Params>;
}

@injectable()
export class DynamicPageLayout {
	constructor(
		@inject(MagnoliaContextProvider) private readonly magnoliaContextProvider: MagnoliaContextProvider,
		@inject(UrlProvider) private readonly urlProvider: UrlProvider,
		@inject(ComposedContextProvider) private readonly composedProvider: ComposedContextProvider,
	) {}

	public async renderUrl(props: Props): Promise<ReactNode> {
		const url = await this.urlProvider.getUrl({
			params: props.params,
		});
		const magnoliaContext = this.magnoliaContextProvider.getMagnoliaContext(url);
		return this.composedProvider.render({ childrenProvider: () => this.render(magnoliaContext.currentLanguage, props.children) });
	}

	public render(language: string, children: ReactNode): ReactNode {
		return (
			<html lang={language}>
				<body>{children}</body>
			</html>
		);
	}
}
