# Proxy/Middleware

The middleware composer executes all middlewares based on their getOrder() value until the first one returns a response.

## Configure Middleware Composer

`/proxy.ts` [see nextJs docu](https://nextjs.org/docs/app/getting-started/proxy)

```typescript
import 'reflect-metadata';
import { container } from './app/Dependencies';
import { NextProxy, NextRequest } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import type { NextFetchEvent } from 'next/dist/server/web/spec-extension/fetch-event';
import { MiddlewareComposer } from '@merkle/magnolia-headless-frontend-nextjs/src/middleware/Middleware.ts';

const middleware: NextProxy = container.resolve<MiddlewareComposer>('MiddlewareComposer').composeMiddleware();

export async function proxy(request: NextRequest, event: NextFetchEvent): Promise<NextMiddlewareResult> {
    return middleware(request, event);
}
```

## Provided middlewares

| Middleware            | order |
| --------------------- | ----- |
| I18nRedirect          | 100   |
| DynamicResponseHeader | 200   |
| Vanity                | 300   |

## Implement custom middleware

`/app/middlewares/SomeMiddleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { AbstractMiddleware } from './Middleware.ts';
import { inject, injectable } from 'tsyringe';

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

    public async apply(req: NextRequest): Promise<NextMiddlewareResult> {
        if (super.isPagePathRequest(req)) {
            // will break chain
            return NextResponse.redirect(new URL('someDestination'));
        }
    }
}
```

Add binding:

```typescript
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DependencyContainer } from 'tsyringe';

function bindSomeMiddleware(container: DependencyContainer): void {
    container.register(TOKEN_PREFIX + 'Middleware', {useClass: SomeMiddleware});
}
```
