import { ReactComponentLike, ReactNodeLike } from 'prop-types';
import AreaProps from '../BaseProps.ts';
import { DependencyContainer } from 'tsyringe';

export default interface EditableAreaProps {
	content: AreaProps;
	parentTemplateId?: string;
	className?: any;
	elementType?: any;
	customView?: ReactComponentLike;
	children?: ReactNodeLike;
	additionalContent?: any;
	additionalComponentContent?: any;
	renderEmpty?: boolean;
	container: DependencyContainer;
	passedAttributes?: Record<string, unknown>;
}
