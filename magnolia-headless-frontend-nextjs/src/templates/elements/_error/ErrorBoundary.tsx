'use client';

import React, { ReactNode } from 'react';
import ErrorElement from './ErrorElement.tsx';

interface ErrorState {
	error: Error | null;
}

interface ErrorProps {
	children: ReactNode;
	isEditMode: boolean;
	throwNotEditMode: boolean;
	path: string;
}

export default class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
	constructor(props: ErrorProps) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { error: error };
	}

	render() {
		if (this.state.error && this.state.error.message !== 'NEXT_REDIRECT') {
			// see REDIRECT_ERROR_CODE in nextJs redirect-error (not exposed)
			return <ErrorElement editMode={this.props.isEditMode} throwNotEditMode={this.props.throwNotEditMode} path={this.props.path} msg={this.state.error.message} />;
		}
		return this.props.children;
	}
}
