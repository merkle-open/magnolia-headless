# API

## [Robots.txt](./RobotsTxtApi.ts)

Consumes content provided by the [Magnolia Robots Endpoint](../../../magnolia-headless-spring/src/main/java/com/merkle/oss/magnolia/headless/api/robots/README.md).

`/app/api/robots.txt/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { container } from '../../Dependencies.ts';
import { RobotsTxtApi } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const robotsApi = container.resolve<RobotsTxtApi>(TOKEN_PREFIX + 'RobotsTxtApi');

export async function GET(req: NextRequest): Promise<Response> {
    return robotsApi.get(req, '/{language}/sitemap/{type}.xml');
}
```

## [Sitemap](./SitemapApi.ts)

Consumes content provided by the [Magnolia Sitemap Endpoint](../../../magnolia-headless-spring/src/main/java/com/merkle/oss/magnolia/headless/api/sitemap/README.md).

`/app/api/[language]/sitemap/[type]/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { container } from '../../../../Dependencies.ts';
import { SitemapApi } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const sitemapApi = container.resolve<SitemapApi>(TOKEN_PREFIX + 'SitemapApi');

export async function GET(req: NextRequest): Promise<Response> {
    const language: string = getLanguage(req.url);
    const type: string = getType(req.url);
    return sitemapApi.get(req, language, type);
}

function getLanguage(req: NextRequest): String {
    //TODO implement
}
function getType(req: NextRequest): String {
    //TODO implement
}
```

## [ErrorPage](./ErrorPageApi.ts)

Consumes content provided by the [Magnolia Page Endpoint](../../../magnolia-headless-spring/src/main/java/com/merkle/oss/magnolia/headless/api/page/README.md).
Frontend API path must be provided in the [HeadlessConfigProviderI](../config/_README.md#headlessconfigprovideri)!

`/app/api/[language]/error/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { container } from '../../../Dependencies.ts';
import { ErrorPageApi } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';

const errorPageApi = container.resolve<ErrorPageApi>(TOKEN_PREFIX + 'ErrorPageApi');

export async function GET(req: NextRequest): Promise<Response> {
    const language: string = getLanguage(req.url);
    return errorPageApi.get(req, language);
}

function getLanguage(req: NextRequest): String {
    //TODO implement
}
```
