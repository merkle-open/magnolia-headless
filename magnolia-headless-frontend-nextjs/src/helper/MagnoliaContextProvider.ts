import { EditorContextService, IMagnoliaContext } from '@magnolia/frontend-helpers-base';
import { inject, injectable } from 'tsyringe';
import { Logger } from './Logger.ts';
import type { HeadlessConfigProviderI } from '../config/ConfigProvider.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

export interface ExtendedMagnoliaContext extends IMagnoliaContext {
	domain: string;
	url: string;
}

@injectable()
export class MagnoliaContextProvider {
	private readonly urlRegex = (url) => /\/([^/]{2})(\/.*$|\?.*$|$)/g.exec(url);
	private readonly multiTree: boolean;

	constructor(
		@inject(TOKEN_PREFIX + 'HeadlessConfigProviderI') readonly configProvider: HeadlessConfigProviderI,
		@inject(TOKEN_PREFIX + 'Logger') private readonly logger: Logger,
	) {
		this.multiTree = configProvider.get().multiTree;
	}

	public getMagnoliaContext(url: URL): ExtendedMagnoliaContext {
		const currentLanguage = this.getLanguage(url.pathname);
		if (this.multiTree) {
			return {
				...EditorContextService.getMagnoliaContext(`${url.pathname}${url.search}`, `/` + currentLanguage, [currentLanguage]),
				domain: url.hostname,
				url: url.toString(),
			};
		}
		const path = this.getPath(url.pathname);
		return {
			...EditorContextService.getMagnoliaContext(`${path}${url.search}`, `/` + currentLanguage, [currentLanguage]),
			nodePath: path, //magnolia is always returning multi tree path (with language)
			domain: url.hostname,
			url: url.toString(),
		};
	}

	private getLanguage(resolvedUrl: string) {
		try {
			this.logger.debug('getting language from ' + resolvedUrl);
			return this.urlRegex(resolvedUrl)[1];
		} catch {
			throw new Error('Failed to get language from url ' + resolvedUrl);
		}
	}

	private getPath(resolvedUrl: string) {
		try {
			this.logger.debug('getting path from ' + resolvedUrl);
			return this.urlRegex(resolvedUrl)[2];
		} catch (err) {
			throw new Error(`Failed to get path from url ${resolvedUrl}`, err);
		}
	}
}
