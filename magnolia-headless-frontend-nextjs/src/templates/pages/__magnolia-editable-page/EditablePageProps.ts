import { IMagnoliaContext, MgnlContent, MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import { MagnoliaConfig } from '@magnolia/react-editor';
import React from 'react';

export default interface EditablePageProps {
	children?: React.ReactElement | React.ReactElement[] | null;
	content: MgnlContent;
	templateAnnotations: MgnlTemplateAnnotations;
	config: MagnoliaConfig;
	magnoliaContext: IMagnoliaContext;
}
