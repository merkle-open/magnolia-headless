import { DependencyContainer } from 'tsyringe';
import { StaticErrorPage } from './pages/_error-static/ErrorStatic.tsx';
import registerShared from './_Dependencies_shared.ts';

export default function register(container: DependencyContainer) {
	registerShared(container);

	container.register(StaticErrorPage, { useClass: StaticErrorPage });
}
