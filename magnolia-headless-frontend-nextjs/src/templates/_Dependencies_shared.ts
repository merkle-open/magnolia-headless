import { DependencyContainer } from 'tsyringe';

import { CombinedComponentMappingsProvider } from './ComponentMappingsProvider.ts';
import { EditablePage } from './pages/__magnolia-editable-page/EditablePage.tsx';
import { EditableComponent } from './components/__magnolia-editable-component/EditableComponent.tsx';
import { EditableAreaClass } from './areas/__magnolia-editable-area/EditableArea.tsx';

export default function register(container: DependencyContainer) {
	container.register(CombinedComponentMappingsProvider, { useClass: CombinedComponentMappingsProvider });
	container.register(EditablePage, { useClass: EditablePage });
	container.register(EditableAreaClass, { useClass: EditableAreaClass });
	container.register(EditableComponent, { useClass: EditableComponent });
}
