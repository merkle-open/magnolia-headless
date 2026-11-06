import { EditableComponent as MagnoliaEditableComponent, RefService } from '@magnolia/react-editor';
import React, { ReactNode } from 'react';
import EditableComponentProps from './EditableComponentProps.ts';
import { IMagnoliaContext, MgnlContent } from '@magnolia/frontend-helpers-base';
import ErrorBoundary from '../../elements/_error/ErrorBoundary.tsx';
import { injectable } from 'tsyringe';

@injectable()
export class EditableComponent {
	public render(props: EditableComponentProps): ReactNode {
		const { key, content, additionalContent, index, container } = props;
		const magnoliaContext: IMagnoliaContext = RefService.getMagnoliaContextRef<IMagnoliaContext>();
		const mergedContent: MgnlContent = this.merge(content, additionalContent);
		const resolvedKey = key ?? content?.['@path'] ?? index;

		return (
			<ErrorBoundary isEditMode={magnoliaContext?.isMagnoliaEdit ?? false} throwNotEditMode={false} path={content!['@path']} key={`error-${resolvedKey}`}>
				<MagnoliaEditableComponent
					key={resolvedKey}
					content={mergedContent}
					passedAttributes={{
						container: container, // must match templates/components/BaseProps.ts
					}}
				/>
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
