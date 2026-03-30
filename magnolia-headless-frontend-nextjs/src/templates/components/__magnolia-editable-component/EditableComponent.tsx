import { EditableComponent as MagnoliaEditableComponent, RefService } from '@magnolia/react-editor';
import React, { ReactNode } from 'react';
import EditableComponentProps from './EditableComponentProps.ts';
import { IMagnoliaContext, MgnlContent } from '@magnolia/frontend-helpers-base';
import ErrorBoundary from '../../elements/_error/ErrorBoundary.tsx';

export class EditableComponent {
	public render(props: EditableComponentProps): ReactNode {
		const { key, content, additionalContent } = props;
		const magnoliaContext: IMagnoliaContext = RefService.getMagnoliaContextRef<IMagnoliaContext>();
		const mergedContent: MgnlContent = this.merge(content, additionalContent);

		return (
			<ErrorBoundary isEditMode={magnoliaContext.isMagnoliaEdit} throwNotEditMode={false} path={content!['@path']} key={`error-${key}`}>
				<MagnoliaEditableComponent {...props} content={mergedContent} />
			</ErrorBoundary>
		);
	}

	protected merge(...content: any[]): any {
		return content.reduce((previousValue: any, currentValue: any): any => {
			return {
				...previousValue,
				...currentValue,
			};
		});
	}
}
