import { DependencyContainer } from 'tsyringe';
import registerApis from './api/_Dependencies_server.ts';
import registerDynamicPages from './dynamic-page/_Dependencies_server.ts';
import registerHelpers from './helper/_Dependencies_server.ts';
import registerMiddlewares from './middleware/_Dependencies_server.ts';
import registerTemplates from './templates/_Dependencies_server.ts';

export function registerServer(container: DependencyContainer) {
	registerApis(container);
	registerDynamicPages(container);
	registerHelpers(container);
	registerMiddlewares(container);
	registerTemplates(container);
}
