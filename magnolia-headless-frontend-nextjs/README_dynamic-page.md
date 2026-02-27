# Dynamic Page
## Layout
`/app/dynamic/[..pathname]/layout.tsx`
```typescript
import { container } from '../../Dependencies';
import { DynamicPageLayout, Props } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicPageLayout = container.resolve<DynamicPageLayout>(TOKEN_PREFIX + 'DynamicPageLayout');

export default async function DefaultLocaleLayout(props: Props) {
    return dynamicPageLayout.renderUrl(props);
}
```

## Page
`/app/dynamic/[..pathname]/page.tsx`
```typescript
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { container } from '../../Dependencies';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicPage as DynamicPageUrl } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { PageProps } from '@merkle-open/magnolia-headless-frontend-nextjs';

//prevent pre-rendering https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic';

const dynamicPage = container.resolve<DynamicPageUrl>(TOKEN_PREFIX + 'DynamicPage');

export default async function DynamicPage(props: PageProps): Promise<ReactNode> {
    return dynamicPage.render(props);
}

/*
 * Even though the page content request is triggered here and in the DynamicPage it is only executed once due to request-memoization
 * (https://nextjs.org/docs/app/deep-dive/caching#request-memoization)
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    return dynamicPage.generateMetadata(props);
}
```

## Error 404
`/app/dynamic/[..pathname]/not-found.tsx`
```typescript
'use client';

import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPage } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { container } from '../../Dependencies';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPage>(TOKEN_PREFIX + 'DynamicErrorPage');

export default function NotFound() {
    return dynamicErrorPage.render(ErrorType.PAGE_NOT_FOUND);
}
```

## Error 500
`/app/dynamic/[..pathname]/error.tsx`
```typescript
'use client';

import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPage } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { container } from '../../Dependencies';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPage>(TOKEN_PREFIX + 'DynamicErrorPage');

export default function Error() {
    return dynamicErrorPage.render(ErrorType.INTERNAL_SERVER_ERROR);
}
```

## Global error handling
### Global error 404
`/app/global-not-found.tsx`
```typescript
'use client';

import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPageGlobal } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { container } from './Dependencies';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPageGlobal>(TOKEN_PREFIX + 'DynamicErrorPageGlobal');

export default function GlobalNotFound() {
    return dynamicErrorPage.render(ErrorType.PAGE_NOT_FOUND);
}
```

### Global error 500
`/app/global-error.tsx`
```typescript
'use client';

import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPageGlobal } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { container } from './Dependencies';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPageGlobal>(TOKEN_PREFIX + 'DynamicErrorPageGlobal');

export default function GlobalError() {
    return dynamicErrorPage.render(ErrorType.INTERNAL_SERVER_ERROR);
}
```
