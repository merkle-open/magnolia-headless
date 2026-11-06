import { DependencyContainer } from 'tsyringe';
import registerDynamicPages from './dynamic-page/_Dependencies_client.ts';
import registerHelpers from './helper/_Dependencies_client.ts';
import registerTemplates from './templates/_Dependencies_client.ts';
import { CONTAINER_PROVIDER_TOKEN } from './Constants.ts';

export function registerClient(container: DependencyContainer) {
	container.register(CONTAINER_PROVIDER_TOKEN, { useValue: container });

	registerDynamicPages(container);
	registerHelpers(container);
	registerTemplates(container);
}
