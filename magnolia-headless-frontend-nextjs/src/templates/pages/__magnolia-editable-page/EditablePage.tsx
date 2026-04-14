import { EditablePage as MagnoliaEditablePage, RefService } from '@magnolia/react-editor';
import React, { ReactNode } from 'react';
import EditablePageProps from './EditablePageProps.ts';
import { IMagnoliaContext } from '@magnolia/frontend-helpers-base';
import ErrorBoundary from '../../elements/_error/ErrorBoundary.tsx';
import { injectable } from 'tsyringe';

@injectable()
export class EditablePage {
	public async render(props: EditablePageProps): Promise<ReactNode> {
		const { content } = props;
		const magnoliaContext: IMagnoliaContext = RefService.getMagnoliaContextRef<IMagnoliaContext>();

		return (
			<ErrorBoundary isEditMode={magnoliaContext.isMagnoliaEdit} throwNotEditMode={true} path={content!['@path']}>
				<MagnoliaEditablePage {...props} />
			</ErrorBoundary>
		);
	}
}
