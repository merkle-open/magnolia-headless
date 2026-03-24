import ComponentProps from '../BaseProps.ts';

export default interface EditableComponentProps {
	key: string;
	content: ComponentProps;
	additionalContent?: any;
	index: number;
}
