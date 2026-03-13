# Config

## Interfaces

### [HeadlessConfigProviderI](./ConfigProvider.ts)

`/app/config/SampleHeadlessConfigProvider.ts`

```typescript
import { Config, HeadlessConfigProviderI } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { injectable } from 'tsyringe';

export enum Themes {
	Default = 'default',
	Theme1 = 'theme1',
}

@injectable()
export class SampleHeadlessConfigProvider implements HeadlessConfigProviderI {
    private readonly config: Config = {
        magnoliaApisProvider: {
            pageContent: (language: string) => process.env.MGNL_API_PAGES.replace('{language}', language),
            ...
        },
        frontendApisProvider: {
            errorPage: (language: string) => `/api/${language}/error`,
        },
        themesProvider: {
            getFallback: () => Themes.Default,
            getAll: () => Object.values(Themes),
        },
        ...
    };

    public get(): Config {
        return this.config;
    }
}
```

### [LoggerI](./Logger.ts)

`/app/config/SampleLogger.ts`

```typescript
import { Level, LoggerI } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { injectable } from 'tsyringe';

@injectable()
export class SampleLogger implements LoggerI {
    public log(level: Level, message: string): void {
        //TODO implement
    }
}
```

### [ComponentMappingsProviderI](./ComponentMappingsProvider.ts)

`/app/config/SampleComponentMappingsProvider.ts`

```typescript
import { injectable } from 'tsyringe';
import { ComponentMappingsProviderI } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { ComponentMappings } from '@magnolia/react-editor';
import someComponent from './components/someComponent/SomeComponent.tsx';

@injectable()
export class SampleComponentMappingsProvider implements ComponentMappingsProviderI {
    getComponentMappings(): ComponentMappings {
        return {
            "<MAGNOLIA_TEMPLATE_ID_SOME_COMPONENT>": someComponent,
           ...
        }
    }
}
```

### [StylesheetProviderI](./StylesheetProvider.ts)

`/app/config/SampleStylesheetProvider.ts`

```typescript
import {injectable} from 'tsyringe';
import {StylesheetProviderI} from '@merkle-open/magnolia-headless-frontend-nextjs';
import {ExtendedMagnoliaContext} from "./MagnoliaContextProvider";

@injectable()
export class SampleStylesheetProvider implements StylesheetProviderI {
    public get(magnoliaContext: ExtendedMagnoliaContext, theme: string): string[] {
        return [`/css/theme/${theme}.min.css`];
    }
}
```

## Binding

`/app/config/_Dependencies.ts`

```typescript
import { DependencyContainer } from 'tsyringe';
import { TOKEN_PREFIX } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { Logger } from '@merkle-open/magnolia-headless-frontend-nextjs';

export default function register(container: DependencyContainer) {
    container.register(TOKEN_PREFIX + 'HeadlessConfigProviderI', {
        useClass: SampleHeadlessConfigProvider,
    });
    container.register(TOKEN_PREFIX + 'ComponentMappingsProviderI', {
        useClass: SampleComponentMappingsProvider,
    });
    container.register(TOKEN_PREFIX + 'StylesheetProviderI', {
        useClass: SampleStylesheetProvider,
    });
    container.register(TOKEN_PREFIX + 'LoggerI', { useClass: SampleLogger });
}
```
