import { NextFetchEvent, NextProxy, NextRequest, NextResponse } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { Logger } from '../helper/Logger.ts';
import { inject, injectable, injectAllWithTransform } from 'tsyringe';
import { Transform } from 'tsyringe/dist/typings/types';

import { TOKEN_PREFIX } from '../Constants.ts';

export interface Middleware {
	apply(request: NextRequest, response: NextResponse, event: NextFetchEvent): NextMiddlewareResult | Promise<NextMiddlewareResult>;

	getOrder(): number;
	getName(): string;
}

export abstract class AbstractMiddleware implements Middleware {
	public abstract apply(request: NextRequest, response: NextResponse, event: NextFetchEvent): NextMiddlewareResult | Promise<NextMiddlewareResult>;

	public abstract getOrder(): number;
	public abstract getName(): string;

	protected isPagePathRequest(req: NextRequest) {
		const isNonPagePathPrefix = /^\/(?:_next|api)\//;
		const isFile = /\..*$/;
		const { pathname } = req.nextUrl;
		return !isNonPagePathPrefix.test(pathname) && !isFile.test(pathname);
	}
}

class MiddlewareTransform implements Transform<Middleware[], Middleware[]> {
	public transform(middlewares: Middleware[]): Middleware[] {
		return middlewares.sort((m1, m2) => m1.getOrder() - m2.getOrder());
	}
}

@injectable()
export class MiddlewareComposer {
	constructor(
		@injectAllWithTransform(TOKEN_PREFIX + 'Middleware', MiddlewareTransform) private middlewares: Middleware[],
		@inject(TOKEN_PREFIX + 'Logger') private logger: Logger,
	) {}

	public composeMiddleware(): NextProxy {
		const middlewares = this.middlewares;
		const logger = this.logger;
		return async function middleware(request: NextRequest, event: NextFetchEvent): Promise<NextMiddlewareResult> {
			const response = NextResponse.next();
			for (const middleware of middlewares) {
				try {
					const result = await middleware.apply(request, response, event);
					if (result instanceof NextResponse || result instanceof Response) {
						return result;
					}
				} catch (e) {
					logger.error(`failed to execute middleware ${middleware.getName()} with order:${middleware.getOrder()}, skipping... error: ${e}`);
				}
			}
			return response;
		};
	}
}
