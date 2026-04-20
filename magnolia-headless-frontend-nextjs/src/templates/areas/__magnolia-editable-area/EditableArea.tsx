import { EditableArea as MagnoliaEditableArea, RefService } from '@magnolia/react-editor';
import React, { ReactElement, ReactNode } from 'react';
import EditableAreaProps from './EditableAreaProps.ts';
import { ContentRendererService, IMagnoliaContext, MgnlContent } from '@magnolia/frontend-helpers-base';
import { EditableComponent } from '../../components/__magnolia-editable-component/EditableComponent.tsx';

export class EditableAreaClass {
	constructor(private readonly editableComponent: EditableComponent) {}

	public render(props: EditableAreaProps): ReactNode {
		const { content, additionalContent, additionalComponentContent } = props;
		const mergedContent = this.merge(content, additionalContent);
		const mergedComponentContents: MgnlContent[] = content?.['@nodes']?.map((nodeName: string): MgnlContent => this.merge(content[nodeName], additionalComponentContent)) || [];
		const children: ReactElement[] = mergedComponentContents?.map((content: MgnlContent, index: number): ReactElement => this.renderComponent(content, index) as ReactElement);

		return (
			this.shouldRender(children.length > 0, props.renderEmpty) && (
				<MagnoliaEditableArea {...props} content={mergedContent}>
					{children}
				</MagnoliaEditableArea>
			)
		);
	}

	protected renderComponent(content: any, index: number): ReactNode {
		return this.editableComponent.render({
			key: ContentRendererService.buildKey(content),
			content,
			index,
		});
	}

	protected merge(...content: any[]): any {
		return content.reduce((previousValue: any, currentValue: any): any => {
			return {
				...previousValue,
				...currentValue,
			};
		});
	}

	protected shouldRender(hasChildren: boolean, renderEmpty?: boolean): boolean {
		if (renderEmpty) {
			return true;
		}
		const magnoliaContext = RefService.getMagnoliaContextRef<IMagnoliaContext>();
		const isEditMode = magnoliaContext?.isMagnoliaEdit;
		return isEditMode || hasChildren;
	}
}

export function EditableArea(props: EditableAreaProps): ReactNode {
	return new EditableAreaClass(new EditableComponent()).render(props);
}
