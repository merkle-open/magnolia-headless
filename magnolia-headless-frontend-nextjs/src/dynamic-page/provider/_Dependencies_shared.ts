import { ComposedContextProvider, CONTEXT_PROVIDER_TOKEN } from './Provider.tsx';
import { DependencyContainer } from 'tsyringe';
import { CspHeaderNonceProvider } from './impl/CspHeaderNonce.tsx';

export default function register(container: DependencyContainer) {
	container.register(ComposedContextProvider, { useClass: ComposedContextProvider });
	container.register(CONTEXT_PROVIDER_TOKEN, { useClass: CspHeaderNonceProvider });
}
