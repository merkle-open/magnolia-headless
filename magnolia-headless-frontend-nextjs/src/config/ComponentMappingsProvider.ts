import { ComponentMappings } from '@magnolia/react-editor';
import { token } from '../Constants.ts';

export interface ComponentMappingsProviderI {
	getComponentMappings(): ComponentMappings;
}

export const COMPONENTS_MAPPINGS_PROVIDER_TOKEN = token('ComponentMappingsProviderI');
