import { DependencyContainer } from 'tsyringe';
import { MetadataProvider } from './MetadataProvider.ts';
import { RestClient } from './RestClient.ts';
import { Logger } from './Logger.ts';
import { BrowserLanguageProvider } from './BrowserLanguageProvider.ts';
import { MagnoliaContextProvider } from './MagnoliaContextProvider.ts';
import { MagnoliaPageRestClient } from './MagnoliaPageRestClient.ts';

export default function register(container: DependencyContainer) {
	container.register(MetadataProvider, { useClass: MetadataProvider });
	container.register(Logger, { useClass: Logger });
	container.register(BrowserLanguageProvider, { useClass: BrowserLanguageProvider });
	container.register(MagnoliaContextProvider, { useClass: MagnoliaContextProvider });
	container.register(MagnoliaPageRestClient, { useClass: MagnoliaPageRestClient });
	container.register(RestClient, { useClass: RestClient });
}
