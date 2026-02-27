import { DependencyContainer } from 'tsyringe';
import { DynamicErrorPage } from './DynamicErrorPage.tsx';
import { DynamicPage } from './DynamicPage.tsx';
import { DynamicErrorPageGlobal } from './DynamicErrorPageGlobal.tsx';
import { DynamicPageLayout } from './DynamicPageLayout.tsx';
import { UrlProvider } from './PageProps.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

export default function register(container: DependencyContainer) {
	container.register(TOKEN_PREFIX + 'DynamicErrorPage', { useClass: DynamicErrorPage });
	container.register(TOKEN_PREFIX + 'DynamicErrorPageGlobal', { useClass: DynamicErrorPageGlobal });
	container.register(TOKEN_PREFIX + 'DynamicPage', { useClass: DynamicPage });
	container.register(TOKEN_PREFIX + 'DynamicPageLayout', { useClass: DynamicPageLayout });
	container.register(TOKEN_PREFIX + 'UrlProvider', { useClass: UrlProvider });
}
