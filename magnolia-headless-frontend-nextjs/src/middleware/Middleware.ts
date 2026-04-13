// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextFetchEvent, NextProxy, NextRequest, NextResponse } from 'next/server';
import { Logger } from '../helper/Logger.ts';
import { inject, injectable, injectAllWithTransform } from 'tsyringe';
// @ts-expect-error: tsyringe missing exports prevents ESM resolution with 'nodenext'.
import { Transform } from 'tsyringe/dist/typings/types';

import { token } from '../Constants.ts';

export interface Middleware {
	apply(request: NextRequest, response: MiddlewareNextResponse, event: NextFetchEvent): Promise<MiddlewareResult>;

	getOrder(): number;
	getName(): string;
}
export interface MiddlewareResult {
	response: MiddlewareNextResponse;
	break?: boolean;
}
export interface MiddlewareNextResponse extends NextResponse, Response {
	requestHeaders: Headers;
}

export const MIDDLEWARE_TOKEN = token('Middleware');

export abstract class AbstractMiddleware implements Middleware {
	public abstract apply(request: NextRequest, response: MiddlewareNextResponse, event: NextFetchEvent): Promise<MiddlewareResult>;

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
		@injectAllWithTransform(MIDDLEWARE_TOKEN, MiddlewareTransform) private readonly middlewares: Middleware[],
		@inject(Logger) private readonly logger: Logger,
	) {}

	public composeMiddleware(): NextProxy {
		const composedMiddleware = new ComposedMiddleware(this.middlewares, this.logger);
		return async function middleware(request: NextRequest, event: NextFetchEvent): Promise<NextResponse> {
			return composedMiddleware.apply(request, event);
		};
	}
}

class ComposedMiddleware {
	constructor(
		private readonly middlewares: Middleware[],
		private readonly logger: Logger,
	) {}

	public async apply(request: NextRequest, event: NextFetchEvent): Promise<NextResponse> {
		const requestHeaders = new Headers(request.headers);
		const response: MiddlewareNextResponse = NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
		response.requestHeaders = requestHeaders;
		return this.triggerMiddleware(this.middlewares, request, response, event).then((result) => result.response);
	}

	private async triggerMiddleware(middlewares: Middleware[], request: NextRequest, response: MiddlewareNextResponse, event: NextFetchEvent): Promise<MiddlewareResult> {
		if (middlewares.length > 0) {
			const [middleware, ...rest] = middlewares;
			return this.triggerMiddlewareSafe(middleware, request, response, event).then((result) => {
				if (!result.break) {
					return this.triggerMiddleware(rest, request, result.response, event);
				}
				return Promise.resolve(result);
			});
		}
		return Promise.resolve({
			response: response,
			break: false,
		});
	}

	private async triggerMiddlewareSafe(middleware: Middleware, request: NextRequest, response: MiddlewareNextResponse, event: NextFetchEvent): Promise<MiddlewareResult> {
		try {
			return middleware.apply(request, response, event);
		} catch (e) {
			this.logger.error(`failed to execute middleware ${middleware.getName()} with order:${middleware.getOrder()}, skipping... error: ${e}`);
			return Promise.resolve({
				response: response,
				break: false,
			});
		}
	}
}
