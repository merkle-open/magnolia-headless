import React, { ReactNode } from 'react';
import { inject, injectable } from 'tsyringe';
import { ContentSecurityPolicyNonceProvider } from '../../../middleware/impl/ContentSecurityPolicyNonceMiddleware.ts';
import { ContextProvider, Props } from '../Provider.tsx';
import { Provider as Delegate } from './CspHeaderNonceContext.tsx';

@injectable()
export class CspHeaderNonceProvider implements ContextProvider {
	constructor(@inject(ContentSecurityPolicyNonceProvider) private readonly cspNonceProvider: ContentSecurityPolicyNonceProvider) {}

	public async render({ childrenProvider }: Props): Promise<ReactNode> {
		const nonce = await this.cspNonceProvider.get();
		return <Delegate value={nonce}>{childrenProvider()}</Delegate>;
	}

	getOrder(): number {
		return 100;
	}
	getName(): string {
		return 'CspHeaderNonce';
	}
}
