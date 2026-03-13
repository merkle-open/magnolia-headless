# Dynamic Page

## Layout

`/app/dynamic/[..pathname]/layout.tsx`

```typescript
import { container } from '../../Dependencies';
import { DynamicPageLayout, Props } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicPageLayout = container.resolve<DynamicPageLayout>(DynamicPageLayout);

export default async function DefaultLocaleLayout(props: Props) {
    return dynamicPageLayout.renderUrl(props);
}
```

## Page

`/app/dynamic/[..pathname]/page.tsx`

```typescript
import { container } from '../../Dependencies'; //must be first import!!
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { DynamicPage as DynamicPageUrl } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { PageProps } from '@merkle-open/magnolia-headless-frontend-nextjs';

//prevent pre-rendering https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic';

const dynamicPage = container.resolve<DynamicPageUrl>(DynamicPageUrl);

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

import { container } from '../../Dependencies';  //must be first import!!
import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPage } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPage>(DynamicErrorPage);

export default function NotFound() {
    return dynamicErrorPage.render(ErrorType.PAGE_NOT_FOUND);
}
```

## Error 500

`/app/dynamic/[..pathname]/error.tsx`

```typescript
'use client';

import { container } from '../../Dependencies'; //must be first import!!
import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPage } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPage>(DynamicErrorPage);

export default function Error() {
    return dynamicErrorPage.render(ErrorType.INTERNAL_SERVER_ERROR);
}
```

## Global error handling

### Global error 404

`/app/global-not-found.tsx`

```typescript
'use client';

import { container } from './Dependencies'; //must be first import!!
import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPageGlobal } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPageGlobal>(DynamicErrorPageGlobal);

export default function GlobalNotFound() {
    return dynamicErrorPage.render(ErrorType.PAGE_NOT_FOUND);
}
```

### Global error 500

`/app/global-error.tsx`

```typescript
'use client';

import { container } from './Dependencies'; //must be first import!!
import { ErrorType } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { DynamicErrorPageGlobal } from '@merkle-open/magnolia-headless-frontend-nextjs';

const dynamicErrorPage = container.resolve<DynamicErrorPageGlobal>(DynamicErrorPageGlobal);

export default function GlobalError() {
    return dynamicErrorPage.render(ErrorType.INTERNAL_SERVER_ERROR);
}
```
