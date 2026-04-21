'use client';

import React, { createContext, ReactNode, useContext } from 'react';

const CspHeaderNonceContext = createContext<string | undefined>(undefined);

interface Props {
	value?: string;
	children: ReactNode;
}

export function Provider({ value, children }: Props) {
	return <CspHeaderNonceContext value={value}>{children}</CspHeaderNonceContext>;
}

export const useCspHeaderNonce = () => useContext(CspHeaderNonceContext);
