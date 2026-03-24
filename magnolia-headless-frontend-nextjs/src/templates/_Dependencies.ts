import { DependencyContainer } from 'tsyringe';

import { CombinedComponentMappingsProvider } from './ComponentMappingsProvider.ts';
import { StaticErrorPage } from './pages/_error-static/ErrorStatic.tsx';
import { EditablePage } from './pages/__magnolia-editable-page/EditablePage.tsx';

export default function register(container: DependencyContainer) {
	container.register(CombinedComponentMappingsProvider, { useClass: CombinedComponentMappingsProvider });
	container.register(StaticErrorPage, { useClass: StaticErrorPage });
	container.register(EditablePage, { useClass: EditablePage });
}
