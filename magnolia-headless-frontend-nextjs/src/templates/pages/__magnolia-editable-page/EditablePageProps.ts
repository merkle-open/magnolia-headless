import { IMagnoliaContext, MgnlTemplateAnnotations } from '@magnolia/frontend-helpers-base';
import { MagnoliaConfig } from '@magnolia/react-editor';
import React from 'react';
import PageProps from '../BaseProps.ts';

export default interface EditablePageProps {
	children?: React.ReactElement | React.ReactElement[] | null;
	content: PageProps;
	templateAnnotations: MgnlTemplateAnnotations;
	config: MagnoliaConfig;
	magnoliaContext: IMagnoliaContext;
	nonce?: string;
}
