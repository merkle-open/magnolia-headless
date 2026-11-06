import { EditablePage as MagnoliaEditablePage } from '@magnolia/react-editor';
import React, { ReactNode } from 'react';
import EditablePageProps from './EditablePageProps.ts';
import ErrorBoundary from '../../elements/_error/ErrorBoundary.tsx';
import { inject, injectable } from 'tsyringe';
import type { DependencyContainer } from 'tsyringe';
import { CONTAINER_PROVIDER_TOKEN } from '../../../Constants.ts';

export interface EditablePagePassedAttributes extends Record<string, unknown> {
	container: DependencyContainer;
}

@injectable()
export class EditablePage {
	constructor(@inject(CONTAINER_PROVIDER_TOKEN) private readonly container: DependencyContainer) {}

	public async render(props: EditablePageProps): Promise<ReactNode> {
		const { content, magnoliaContext } = props;
		return (
			<ErrorBoundary isEditMode={magnoliaContext.isMagnoliaEdit} throwNotEditMode={true} path={content!['@path']}>
				<MagnoliaEditablePage {...props} passedAttributes={this.getPassedAttributes(this.container, props)} />
			</ErrorBoundary>
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected getPassedAttributes(container: DependencyContainer, props: EditablePageProps): EditablePagePassedAttributes {
		return {
			container: container, // must match templates/pages/BaseProps.ts
		};
	}
}
