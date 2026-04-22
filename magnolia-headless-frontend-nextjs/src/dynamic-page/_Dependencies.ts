import { DependencyContainer } from 'tsyringe';
import { DynamicErrorPage } from './DynamicErrorPage.tsx';
import { DynamicPage } from './DynamicPage.tsx';
import { DynamicErrorPageGlobal } from './DynamicErrorPageGlobal.tsx';
import { DynamicPageLayout } from './DynamicPageLayout.tsx';
import { UrlProvider } from './PageProps.ts';
import { ErrorPageLoader } from './AbstractDynamicErrorPage.tsx';

export default function register(container: DependencyContainer) {
	container.register(DynamicErrorPage, { useClass: DynamicErrorPage });
	container.register(DynamicErrorPageGlobal, { useClass: DynamicErrorPageGlobal });
	container.register(DynamicPage, { useClass: DynamicPage });
	container.register(DynamicPageLayout, { useClass: DynamicPageLayout });
	container.register(UrlProvider, { useClass: UrlProvider });
	container.register(ErrorPageLoader, { useClass: ErrorPageLoader });
}
