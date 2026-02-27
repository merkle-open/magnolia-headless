import { ComponentMappings } from '@magnolia/react-editor';
import components_error_ErrorComponent_tsx from './components/_error/ErrorComponent.tsx';
import components_redirect_RedirectComponent_tsx from './components/_redirect/RedirectComponent.tsx';

export default function getComponentMappings(): ComponentMappings {
	return {
		'merkle-open_magnolia-headless:__error': components_error_ErrorComponent_tsx,
		'merkle-open_magnolia-headless:__redirect': components_redirect_RedirectComponent_tsx,
	};
}
