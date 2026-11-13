import AreaProps from '../BaseProps.ts';

export default interface EditableAreaProps {
	content: AreaProps;
	parentTemplateId?: string;
	className?: any;
	elementType?: any;
	customView?: React.ElementType;
	children?: React.ReactElement | React.ReactElement[] | null;
	additionalContent?: any;
	additionalComponentContent?: any;
	renderEmpty?: boolean;
}
