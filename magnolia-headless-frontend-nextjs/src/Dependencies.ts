import { DependencyContainer } from 'tsyringe';
import registerApis from './api/_Dependencies.ts';
import registerDynamicPages from './dynamic-page/_Dependencies.ts';
import registerHelpers from './helper/_Dependencies.ts';
import registerMiddlewares from './middleware/_Dependencies.ts';
import registerTemplates from './templates/_Dependencies.ts';

export function register(container: DependencyContainer) {
	registerApis(container);
	registerDynamicPages(container);
	registerHelpers(container);
	registerMiddlewares(container);
	registerTemplates(container);
}
