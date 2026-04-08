import { DependencyContainer } from 'tsyringe';
import { DynamicHeaderMiddleware } from './impl/DynamicHeaderMiddleware.ts';
import { I18nRedirectMiddleware } from './impl/I18nRedirectMiddleware.ts';
import { VanityMiddleware } from './impl/VanityMiddleware.ts';
import { MiddlewareComposer, MIDDLEWARE_TOKEN } from './Middleware.ts';

export default function register(container: DependencyContainer) {
	container.register(MIDDLEWARE_TOKEN, { useClass: DynamicHeaderMiddleware });
	container.register(MIDDLEWARE_TOKEN, { useClass: I18nRedirectMiddleware });
	container.register(MIDDLEWARE_TOKEN, { useClass: VanityMiddleware });
	container.register(MiddlewareComposer, { useClass: MiddlewareComposer });
}
