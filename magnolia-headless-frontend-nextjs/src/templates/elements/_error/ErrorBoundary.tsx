'use client';

import React, { ReactNode, Suspense } from 'react';
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
		if (this.state.error) {
			return <ErrorElement editMode={this.props.isEditMode} throwNotEditMode={this.props.throwNotEditMode} path={this.props.path} msg={this.state.error.message} />;
		}
		return <Suspense fallback={null}>{this.props.children}</Suspense>;
	}
}
