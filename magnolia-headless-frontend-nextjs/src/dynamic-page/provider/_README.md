# Context Provider

The provider composer executes all providers based on their getOrder() value. It is used in the dynamicPageLayout.

<b>Providers are not applied for global error and global not found pages (due to NextJs only allowing client components)!!<b>

## Provided providers

| Provider       | order | description                   |
| -------------- | ----- | ----------------------------- |
| CspHeaderNonce | 100   | Provides the csp header nonce |

## Implement custom provider

`/app/dynamic/[..pathname]/provider/SomeContext.tsx`

```typescript
'use client';
import React, { createContext, ReactNode, useContext } from 'react';

const SomeContext = createContext<string | undefined>(undefined);

interface Props {
    value?: string;
    children: ReactNode;
}

export function Provider({ value, children }: Props) {
    return <SomeContext value={value}>{children}</SomeContext>;
}

export const useSomeContext = () => useContext(SomeContext);

```

`/app/dynamic/[..pathname]/provider/SomeProvider.tsx`

```typescript
import React, {ReactNode} from 'react';
import {inject, injectable} from 'tsyringe';
import {Provider, Props} from '../Provider.tsx';
import {ContextProvider, ContextProviderProps} from '@merkle-open/magnolia-headless-frontend-nextjs';
import {Provider as Delegate} from './SomeContext.tsx';

@injectable()
export class SomeContextProvider implements ContextProvider {

    public async render({childrenProvider}: ContextProviderProps): Promise<ReactNode> {
        return <Delegate value = {"someContextValue"} > {childrenProvider()} < /Delegate>;
    }

    getOrder(): number {
        return 200;
    }

    getName(): string {
        return 'SomeProvider';
    }
}
```

Add binding:

```typescript
import { CONTEXT_PROVIDER_TOKEN } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DependencyContainer } from 'tsyringe';

function bindSomeContextProvider(container: DependencyContainer): void {
    container.register(CONTEXT_PROVIDER_TOKEN, {useClass: SomeContextProvider});
}
```
