import { ExtendedMagnoliaContext } from '../helper/MagnoliaContextProvider.ts';
import { token } from '../Constants.ts';

export interface StylesheetProviderI {
	get(magnoliaContext: ExtendedMagnoliaContext, theme: string): string[];
}
export const STYLESHEET_PROVIDER_TOKEN = token('StylesheetProviderI');
