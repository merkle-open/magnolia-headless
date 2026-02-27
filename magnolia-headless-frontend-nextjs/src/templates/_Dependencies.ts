import { DependencyContainer } from 'tsyringe';

import { TOKEN_PREFIX } from '../Constants.ts';
import { CombinedComponentMappingsProvider } from './ComponentMappingsProvider.ts';

export default function register(container: DependencyContainer) {
	container.register(TOKEN_PREFIX + 'CombinedComponentMappingsProvider', { useClass: CombinedComponentMappingsProvider });
}
