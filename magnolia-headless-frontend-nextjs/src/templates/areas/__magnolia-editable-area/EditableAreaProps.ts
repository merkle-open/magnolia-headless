import { ReactComponentLike, ReactNodeLike } from 'prop-types';

export default interface EditableAreaProps {
	content: any;
	parentTemplateId?: string;
	className?: any;
	elementType?: any;
	customView?: ReactComponentLike;
	children?: ReactNodeLike;
	additionalContent?: any;
	additionalComponentContent?: any;
}
