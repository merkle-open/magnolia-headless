import { DependencyContainer } from 'tsyringe';
import { DynamicResponseHeaderMiddleware } from './impl/DynamicResponseHeaderMiddleware.ts';
import { I18nRedirectMiddleware } from './impl/I18nRedirectMiddleware.ts';
import { VanityMiddleware } from './impl/VanityMiddleware.ts';
import { MiddlewareComposer } from './Middleware.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

export default function register(container: DependencyContainer) {
	container.register(TOKEN_PREFIX + 'Middleware', { useClass: DynamicResponseHeaderMiddleware });
	container.register(TOKEN_PREFIX + 'Middleware', { useClass: I18nRedirectMiddleware });
	container.register(TOKEN_PREFIX + 'Middleware', { useClass: VanityMiddleware });
	container.register(TOKEN_PREFIX + 'MiddlewareComposer', { useClass: MiddlewareComposer });
}
