import { ExtendedMagnoliaContext } from '../helper/MagnoliaContextProvider.ts';

export interface StylesheetProviderI {
	get(magnoliaContext: ExtendedMagnoliaContext, theme: string): string[];
}
