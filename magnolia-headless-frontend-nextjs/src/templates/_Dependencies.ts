import { DependencyContainer } from 'tsyringe';

import { TOKEN_PREFIX } from '../Constants.ts';
import { CombinedComponentMappingsProvider } from './ComponentMappingsProvider.ts';
import { StaticErrorPage } from './pages/_error-static/ErrorStatic.tsx';

export default function register(container: DependencyContainer) {
	container.register(TOKEN_PREFIX + 'CombinedComponentMappingsProvider', { useClass: CombinedComponentMappingsProvider });
	container.register(TOKEN_PREFIX + 'StaticErrorPage', { useClass: StaticErrorPage });
}
