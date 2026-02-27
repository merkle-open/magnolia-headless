import { ComponentMappings } from '@magnolia/react-editor';
import { inject, injectable } from 'tsyringe';
import { TOKEN_PREFIX } from '../Constants.ts';
import getComponentMappings from './magnolia.config.ts';
import { type ComponentMappingsProviderI } from '../config/ComponentMappingsProvider.ts';

@injectable()
export class CombinedComponentMappingsProvider implements ComponentMappingsProviderI {
	constructor(@inject(TOKEN_PREFIX + 'ComponentMappingsProviderI') private readonly componentMappingsProvider: ComponentMappingsProviderI) {}

	public getComponentMappings(): ComponentMappings {
		return {
			...getComponentMappings(),
			...this.componentMappingsProvider.getComponentMappings(),
		};
	}
}
