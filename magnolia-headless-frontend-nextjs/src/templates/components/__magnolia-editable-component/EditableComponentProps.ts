import ComponentProps from '../BaseProps.ts';
import { DependencyContainer } from 'tsyringe';

export default interface EditableComponentProps {
	key: string;
	content: ComponentProps;
	additionalContent?: any;
	index: number;
	container: DependencyContainer;
	passedAttributes?: Record<string, unknown>;
}
