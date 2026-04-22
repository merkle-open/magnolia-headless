import { ComposedContextProvider, CONTEXT_PROVIDER_TOKEN } from './Provider.tsx';
import { DependencyContainer } from 'tsyringe';

export default function register(container: DependencyContainer) {
	container.register(ComposedContextProvider, { useClass: ComposedContextProvider });
}
