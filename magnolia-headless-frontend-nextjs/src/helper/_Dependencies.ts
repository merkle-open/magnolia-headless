import { DependencyContainer } from 'tsyringe';
import { MetadataProvider } from './MetadataProvider.ts';
import { RestClient } from './RestClient.ts';
import { Logger } from './Logger.ts';
import { BrowserLanguageProvider } from './BrowserLanguageProvider.ts';
import { MagnoliaContextProvider } from './MagnoliaContextProvider.ts';
import { MagnoliaPageRestClient } from './MagnoliaPageRestClient.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

export default function register(container: DependencyContainer) {
	container.register(TOKEN_PREFIX + 'MetadataProvider', { useClass: MetadataProvider });
	container.register(TOKEN_PREFIX + 'Logger', { useClass: Logger });
	container.register(TOKEN_PREFIX + 'BrowserLanguageProvider', { useClass: BrowserLanguageProvider });
	container.register(TOKEN_PREFIX + 'MagnoliaContextProvider', { useClass: MagnoliaContextProvider });
	container.register(TOKEN_PREFIX + 'MagnoliaPageRestClient', { useClass: MagnoliaPageRestClient });
	container.register(TOKEN_PREFIX + 'RestClient', { useClass: RestClient });
}
