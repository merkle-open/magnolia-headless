# Magnolia NextJs Headless Frontend
- [Templates](./src/templates/_README.md)
- [Proxy/Middleware](./src/middleware/_README.md)
- [Config](./src/config/_README.md)
- [API](./src/api/_README.md)
- [Dynamic-Page](./README_dynamic-page.md)

## setup
- Add the following dependencies to your package.json
  - `@merkle-open/magnolia-headless-frontend-nextjs`
  - [`tsyringe`](https://github.com/Microsoft/tsyringe)
  - `reflect-metadata`
  - `next`
  - `react`
  - `react-dom`
- Configure tsconfig.json to include the following settings (`./tsconfig.json`)
  ```json
  {
    "compilerOptions": {
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true
    },
    "include": [
      "node_modules/@merkle-open/magnolia-headless-frontend-nextjs"
    ]
  }
  ```
- Configure the [middleware composer](./src/middleware/_README.md#configure-middleware-composer)
- Implement and bind the interfaces specified [here](./src/config/_README.md) 
- Implement API endpoints specified [here](./src/api/_README.md)
- Configure [instrumentation.ts](https://nextjs.org/docs/app/guides/instrumentation#importing-files-with-side-effects) (`./instrumentation.ts`)
  ```typescript
  export async function register() {
      await import('reflect-metadata');
  }
  ```
- Setup [dynamic page](./README_dynamic-page.md)
- Setup Dependencies (`./Dependencies.ts`)
  ```typescript
  import 'reflect-metadata';
  import { container } from 'tsyringe';
  import { register as registerOss } from '@merkle-open/magnolia-headless-frontend-nextjs';
  import registerConfigs from './config/_Dependencies.ts';
  
  registerConfigs(container);
  registerOss(container);
  
  export { container };
  ```
- Setup next.config.ts (`./next.config.ts`)
  ```typescript
  import type { NextConfig } from 'next';
  import type { Rewrite } from 'next/dist/lib/load-custom-routes';
  
  const nextConfig: NextConfig = {
      transpilePackages: ['@merkle-open/magnolia-headless-frontend-nextjs'],
      async rewrites(): Promise<Rewrite[]> {
          return [
              {
                  source: '/robots.txt',
                  destination: '/api/robots.txt',
              },
              {
                  source: '/:language([a-z]{2})/sitemap/:type',
                  destination: '/api/:language/sitemap/:type',
              },
              {
                  source: '/:language([a-z]{2})/:path*',
                  destination: '/dynamic/:language/:path*',
              },
          ];
      },
      ...
  };
  export default nextConfig;
  ```
