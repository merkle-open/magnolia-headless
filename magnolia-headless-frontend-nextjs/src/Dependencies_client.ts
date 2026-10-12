import { DependencyContainer } from 'tsyringe';
import registerDynamicPages from './dynamic-page/_Dependencies_client.ts';
import registerHelpers from './helper/_Dependencies_client.ts';
import registerTemplates from './templates/_Dependencies_client.ts';

export function registerClient(container: DependencyContainer) {
	registerDynamicPages(container);
	registerHelpers(container);
	registerTemplates(container);
}
