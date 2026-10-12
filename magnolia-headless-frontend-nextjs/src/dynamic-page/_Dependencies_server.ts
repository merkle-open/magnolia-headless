import { DependencyContainer } from 'tsyringe';
import { DynamicPage } from './DynamicPage.tsx';
import { DynamicPageLayout } from './DynamicPageLayout.tsx';
import { UrlProvider } from './PageProps.ts';
import registerProvider from './provider/_Dependencies_server.ts';

export default function register(container: DependencyContainer) {
	container.register(DynamicPage, { useClass: DynamicPage });
	container.register(DynamicPageLayout, { useClass: DynamicPageLayout });
	container.register(UrlProvider, { useClass: UrlProvider });

	registerProvider(container);
}
