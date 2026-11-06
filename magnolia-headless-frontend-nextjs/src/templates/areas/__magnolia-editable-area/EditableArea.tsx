import { EditableArea as MagnoliaEditableArea, RefService } from '@magnolia/react-editor';
import React, { ReactElement, ReactNode } from 'react';
import EditableAreaProps from './EditableAreaProps.ts';
import { ContentRendererService, IMagnoliaContext, MgnlContent } from '@magnolia/frontend-helpers-base';
import { EditableComponent } from '../../components/__magnolia-editable-component/EditableComponent.tsx';
import { injectable, inject, DependencyContainer } from 'tsyringe';

export interface EditableAreaPassedAttributes extends Record<string, unknown> {
	container: DependencyContainer;
}

@injectable()
export class EditableAreaClass {
	constructor(@inject(EditableComponent) private readonly editableComponent: EditableComponent) {}

	public render(props: EditableAreaProps): ReactNode {
		const { content, additionalContent, additionalComponentContent, container, passedAttributes } = props;
		const mergedContent = this.merge(content, additionalContent);
		const mergedComponentContents: MgnlContent[] = content?.['@nodes']?.map((nodeName: string): MgnlContent => this.merge(content[nodeName], additionalComponentContent)) || [];
		const children: ReactElement[] = mergedComponentContents?.map(
			(content: MgnlContent, index: number): ReactElement => this.renderComponent(content, index, container, passedAttributes) as ReactElement,
		);

		return (
			this.shouldRender(children.length > 0, props.renderEmpty) && (
				<MagnoliaEditableArea {...props} content={mergedContent} passedAttributes={this.getPassedAttributes(container, props)}>
					{children}
				</MagnoliaEditableArea>
			)
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected getPassedAttributes(container: DependencyContainer, props: EditableAreaProps): EditableAreaPassedAttributes {
		return {
			container: container, // must match templates/pages/BaseProps.ts
		};
	}

	protected renderComponent(content: any, index: number, container: DependencyContainer, passedAttributes?: Record<string, unknown>): ReactNode {
		return this.editableComponent.render({
			key: ContentRendererService.buildKey(content),
			content,
			index,
			container,
			passedAttributes,
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
	return props.container.resolve<EditableAreaClass>(EditableAreaClass).render(props);
}
