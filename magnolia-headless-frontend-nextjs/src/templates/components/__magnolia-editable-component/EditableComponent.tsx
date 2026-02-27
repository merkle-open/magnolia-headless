import { EditableComponent as MagnoliaEditableComponent, RefService } from '@magnolia/react-editor';
import React, { ReactNode } from 'react';
import EditableComponentProps from './EditableComponentProps.ts';
import { IMagnoliaContext } from '@magnolia/frontend-helpers-base';
import ErrorBoundary from '../../elements/_error/ErrorBoundary.tsx';

export function EditableComponent(props: EditableComponentProps): ReactNode {
	const { content, additionalContent } = props;
	const magnoliaContext = RefService.getMagnoliaContextRef<IMagnoliaContext>();

	return (
		<ErrorBoundary isEditMode={magnoliaContext.isMagnoliaEdit} throwNotEditMode={false} path={content!['@path']}>
			<MagnoliaEditableComponent {...props} content={merge(content, additionalContent)} />
		</ErrorBoundary>
	);
}

function merge(first: any, second: any): any {
	return {
		...first,
		...second,
	};
}
