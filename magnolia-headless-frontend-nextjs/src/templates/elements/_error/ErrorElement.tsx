import React, { ReactNode } from 'react';
import ErrorElementProps from './ErrorElementProps.ts';
import { constants, EditableComment, RefService } from '@magnolia/react-editor';

export default function ErrorElement({ msg, path, editMode, throwNotEditMode }: ErrorElementProps): ReactNode {
	if (!editMode) {
		if (throwNotEditMode) {
			throw new Error(msg);
		}
		return;
	}
	const templateAnnotations = RefService.getTemplateAnnotationsRef();
	const annotation = templateAnnotations?.[path] || '';

	return (
		<>
			<EditableComment annotation={annotation} shouldRefresh={true} />
			<div className="merkle-open_magnolia-headless_author_error">{msg}</div>
			{annotation ? <EditableComment annotation={constants.CLOSED_COMPONENT_COMMENT} /> : <EditableComment annotation="" />}
		</>
	);
}
