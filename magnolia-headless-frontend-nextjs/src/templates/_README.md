# Templates

## template mapping

A mapping needs to be supplied in order for the magnolia-react-editor to map magnolia templates to react components.
This is provided by the [ComponentMappingsProviderI](../config/_README.md#componentmappingsprovideri).

### Generate mapping

The mapping can also be generated during build time using the following convention and the [generate-magnolia-config.ts](../scripts/generate-magnolia-config.ts) script:

#### TemplateId → React component mapping

Each magnolia page/area/component has to define a template.json:

```json
{
  "templateId": "<MAGNOLIA_TEMPLATE_ID>",
  "file": "<REACT_COMPONENT>.tsx"
}
```

generate `magnolia.config.ts` during build and use delegate to it in the ComponentMappingsProviderI

```json
{
    "scripts": {
        "build-generate-magnolia-config": "npx tsx node_modules/@merkle-open/magnolia-headless-frontend-nextjs/src/scripts/generate-magnolia-config.ts <TARGET_DIR> <CUSTOM_TEMPLATES_DIR1> <CUSTOM_TEMPLATES_DIR2>",
        "build": "npm run build-generate-magnolia-config && next build"
    }
}
```

# provided templates

The lib provides the following templates. You can map them differently in your ComponentMappingsProviderI.

| template | id                                         | model                                                     | description                                 |
| -------- | ------------------------------------------ | --------------------------------------------------------- | ------------------------------------------- |
| redirect | `merkle-open_magnolia-headless:__redirect` | [props](./components/_redirect/RedirectComponentProps.ts) | triggers a redirect                         |
| error    | `merkle-open_magnolia-headless:__error`    | [props](./components/_error/ErrorComponentProps.ts)       | renders an error if editMode is set to true |

# example

## template mapping

`/app/templates/components/template.json`

```json
{
	"templateId": "some-project-name:components/SampleComponent",
	"file": "SampleComponentProps.tsx"
}
```

## Properties

`/app/templates/components/SampleComponentProps.ts`

```typescript
import { ComponentBaseProps } from '@merkle-open/magnolia-headless-frontend-nextjs';
import { AreaBaseProps } from '@merkle-open/magnolia-headless-frontend-nextjs';

export default interface SampleComponentProps extends ComponentBaseProps {
    someProperty: string;
    someArea: AreaBaseProps;
}
```

## React component

`/app/templates/components/SampleComponent.tsx`

```typescript
import React, { ReactNode } from 'react';
import SampleComponentProps from './SampleComponentProps.ts';

export default function SampleComponent({ someProperty, someArea }: SampleComponentProps): ReactNode {
    return (
        <div>
            <div>{someProperty}</div>
            <div>{someArea && <EditableArea content={someArea} />}</div>
        </div>
    );
}
```
