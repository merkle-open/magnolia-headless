import React, { ReactNode } from 'react';
import ErrorElement from '../../elements/_error/ErrorElement.tsx';
import ErrorComponentProps from './ErrorComponentProps.ts';

export default function Error(props: ErrorComponentProps): ReactNode {
	return <ErrorElement {...props} />;
}
