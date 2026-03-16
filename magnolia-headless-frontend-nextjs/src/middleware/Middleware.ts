// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextFetchEvent, NextProxy, NextRequest, NextResponse } from 'next/server';
// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { Logger } from '../helper/Logger.ts';
import { inject, injectable, injectAllWithTransform } from 'tsyringe';
// @ts-expect-error: tsyringe missing exports prevents ESM resolution with 'nodenext'.
import { Transform } from 'tsyringe/dist/typings/types';

import { token } from '../Constants.ts';

export interface Middleware {
	apply(request: NextRequest, response: NextResponse, event: NextFetchEvent): NextMiddlewareResult | Promise<NextMiddlewareResult>;

	getOrder(): number;
	getName(): string;
}
export const MIDDLEWARE_TOKEN = token('Middleware');

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
		@injectAllWithTransform(MIDDLEWARE_TOKEN, MiddlewareTransform) private middlewares: Middleware[],
		@inject(Logger) private logger: Logger,
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
