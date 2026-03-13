import { ComponentMappings } from '@magnolia/react-editor';
import { inject, injectable } from 'tsyringe';
import getComponentMappings from './magnolia.config.ts';
import { type ComponentMappingsProviderI, COMPONENTS_MAPPINGS_PROVIDER_TOKEN } from '../config/ComponentMappingsProvider.ts';

@injectable()
export class CombinedComponentMappingsProvider implements ComponentMappingsProviderI {
	constructor(@inject(COMPONENTS_MAPPINGS_PROVIDER_TOKEN) private readonly componentMappingsProvider: ComponentMappingsProviderI) {}

	public getComponentMappings(): ComponentMappings {
		return {
			...getComponentMappings(),
			...this.componentMappingsProvider.getComponentMappings(),
		};
	}
}
