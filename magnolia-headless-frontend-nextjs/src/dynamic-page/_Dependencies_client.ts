import { DependencyContainer } from 'tsyringe';
import { DynamicErrorPage } from './DynamicErrorPage.tsx';
import { DynamicErrorPageGlobal } from './DynamicErrorPageGlobal.tsx';
import { ErrorPageLoader } from './AbstractDynamicErrorPage.tsx';
import registerProvider from './provider/_Dependencies_client.ts';

export default function register(container: DependencyContainer) {
	container.register(DynamicErrorPage, { useClass: DynamicErrorPage });
	container.register(DynamicErrorPageGlobal, { useClass: DynamicErrorPageGlobal });
	container.register(ErrorPageLoader, { useClass: ErrorPageLoader });

	registerProvider(container);
}
