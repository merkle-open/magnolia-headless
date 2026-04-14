// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { NextRequest } from 'next/server';
import { AbstractMiddleware, MiddlewareNextResponse, MiddlewareResult } from '../Middleware.ts';
import { injectable } from 'tsyringe';

const CSP_HEADER_KEY = 'Content-Security-Policy';
const NONCE_HEADER_KEY = 'x-nonce';

// see https://nextjs.org/docs/app/guides/content-security-policy#how-nonces-work-in-nextjs
@injectable()
export class ContentSecurityPolicyNonceMiddleware extends AbstractMiddleware {
	constructor() {
		super();
	}

	public getOrder(): number {
		return 1000;
	}
	public getName(): string {
		return 'CSP-nonce';
	}

	public async apply(_req: NextRequest, res: MiddlewareNextResponse): Promise<MiddlewareResult> {
		if (res.headers.has(CSP_HEADER_KEY)) {
			const nonce = this.generateNonce();
			const cspHeader = this.replacePlaceholder(res.headers.get(CSP_HEADER_KEY), nonce);

			res.requestHeaders.set(NONCE_HEADER_KEY, nonce);
			res.requestHeaders.set(CSP_HEADER_KEY, cspHeader);
			res.headers.set(NONCE_HEADER_KEY, nonce);
			res.headers.set(CSP_HEADER_KEY, cspHeader);
		}
		return Promise.resolve({ response: res });
	}

	protected generateNonce(): string {
		return Buffer.from(crypto.randomUUID()).toString('base64');
	}

	protected replacePlaceholder(cspHeader: string, nonce: string): string {
		return cspHeader.replaceAll('${nonce}', nonce);
	}
}

@injectable()
export class ContentSecurityPolicyNonceProvider {
	public async get(): Promise<string | undefined> {
		try {
			// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
			const headerList = await import('next/headers').then((headers) => headers.headers());
			return headerList.get(NONCE_HEADER_KEY);
		} catch {
			return Promise.resolve(undefined);
		}
	}
}
