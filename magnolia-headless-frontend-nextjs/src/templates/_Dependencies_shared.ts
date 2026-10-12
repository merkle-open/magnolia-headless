import { DependencyContainer } from 'tsyringe';

import { CombinedComponentMappingsProvider } from './ComponentMappingsProvider.ts';
import { EditablePage } from './pages/__magnolia-editable-page/EditablePage.tsx';

export default function register(container: DependencyContainer) {
	container.register(CombinedComponentMappingsProvider, { useClass: CombinedComponentMappingsProvider });
	container.register(EditablePage, { useClass: EditablePage });
}
