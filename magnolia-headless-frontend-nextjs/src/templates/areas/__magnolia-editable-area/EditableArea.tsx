import { EditableArea as MagnoliaEditableArea, RefService } from '@magnolia/react-editor';
import React, { ReactNode } from 'react';
import EditableAreaProps from './EditableAreaProps.ts';
import { ContentRendererService, IMagnoliaContext, MgnlContent } from '@magnolia/frontend-helpers-base';
import { EditableComponent } from '../../components/__magnolia-editable-component/EditableComponent.tsx';

function shouldRender(hasChildren: boolean, renderEmpty?: boolean) {
	if (renderEmpty) {
		return true;
	}
	const magnoliaContext = RefService.getMagnoliaContextRef<IMagnoliaContext>();
	const isEditMode = magnoliaContext?.isMagnoliaEdit;
	return isEditMode || hasChildren;
}

export function EditableArea(props: EditableAreaProps): ReactNode {
	const { content, additionalContent, additionalComponentContent } = props;
	const componentNodeMapping = content['@nodes'].map((nodeName: any) => [nodeName, merge(content[nodeName], additionalComponentContent)]);
	const mergedContent = merge(merge(content, new Map(componentNodeMapping)), additionalContent);

	const componentContents: MgnlContent[] = content?.['@nodes']?.map((nodeName: string) => content[nodeName] as MgnlContent) || [];
	const children = componentContents?.map((item, index) => <EditableComponent key={ContentRendererService.buildKey(item)} content={item} index={index} />);

	return (
		shouldRender(children.length > 0, props.renderEmpty) && (
			<MagnoliaEditableArea {...props} content={mergedContent}>
				{children}
			</MagnoliaEditableArea>
		)
	);
}

function merge(first: any, second: any): any {
	return {
		...first,
		...second,
	};
}
