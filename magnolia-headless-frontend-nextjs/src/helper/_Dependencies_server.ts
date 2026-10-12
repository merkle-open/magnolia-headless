import { DependencyContainer } from 'tsyringe';
import { MetadataProvider } from './MetadataProvider.ts';
import { RestClient } from './RestClient.ts';
import { BrowserLanguageProvider } from './BrowserLanguageProvider.ts';
import { MagnoliaPageRestClient } from './MagnoliaPageRestClient.ts';
import registerShared from './_Dependencies_shared.ts';

export default function register(container: DependencyContainer) {
	registerShared(container);

	container.register(MetadataProvider, { useClass: MetadataProvider });
	container.register(BrowserLanguageProvider, { useClass: BrowserLanguageProvider });
	container.register(MagnoliaPageRestClient, { useClass: MagnoliaPageRestClient });
	container.register(RestClient, { useClass: RestClient });
}
