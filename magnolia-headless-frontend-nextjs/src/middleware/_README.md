# Proxy/Middleware

The middleware composer executes all middlewares based on their getOrder() value until the first one returns a result with break=true.

## Configure Middleware Composer

`/proxy.ts` [see nextJs docu](https://nextjs.org/docs/app/getting-started/proxy)

```typescript
import { container } from './app/Dependencies';
import { NextProxy, NextRequest } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import type { NextFetchEvent } from 'next/dist/server/web/spec-extension/fetch-event';
import { MiddlewareComposer } from '@merkle-open/magnolia-headless-frontend-nextjs';

const middleware: NextProxy = container.resolve<MiddlewareComposer>(MiddlewareComposer).composeMiddleware();

export async function proxy(request: NextRequest, event: NextFetchEvent): Promise<NextMiddlewareResult> {
    return middleware(request, event);
}
```

## Provided middlewares

| Middleware    | order | description                                                    |
| ------------- | ----- | -------------------------------------------------------------- |
| I18nRedirect  | 100   | redirects to browser lang if url doesn't contain language      |
| DynamicHeader | 200   | sets request/response headers provided by backend endpoint     |
| Vanity        | 300   | redirects/forwards based on backend endpoint                   |
| CSP-nonce     | 1000  | generates nonce and replaces csp header '${nonce}' placeholder |

## Implement custom middleware

`/app/middlewares/SomeMiddleware.ts`

```typescript
import {NextRequest, NextResponse} from 'next/server';
import {NextMiddlewareResult} from 'next/dist/server/web/types';
import {inject, injectable} from 'tsyringe';
import { AbstractMiddleware, MiddlewareNextResponse, MiddlewareResult } from '@merkle-open/magnolia-headless-frontend-nextjs';

@injectable()
export class SomeMiddleware extends AbstractMiddleware {
    constructor() {
        super();
    }

    public getOrder(): number {
        return 301;
    }

    public getName(): string {
        return 'SomeMiddleware';
    }

    public async apply(req: NextRequest, res: MiddlewareNextResponse): Promise<MiddlewareResult> {
        if (super.isPagePathRequest(req)) {
            // will break chain
            return Promise.resolve({
                response: NextResponse.redirect(new URL('someDestination')),
                break: true
            });
        }
        return Promise.resolve({response: res});
    }
}
```

Add binding:

```typescript
import { MIDDLEWARE_TOKEN } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DependencyContainer } from 'tsyringe';

function bindSomeMiddleware(container: DependencyContainer): void {
    container.register(MIDDLEWARE_TOKEN, {useClass: SomeMiddleware});
}
```
