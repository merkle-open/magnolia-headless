// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import { redirect, permanentRedirect } from 'next/navigation';
import { ReactNode } from 'react';
import RedirectComponentProps, { RedirectType } from './RedirectComponentProps.ts';

export default function Redirect({ destination, statusCode }: RedirectComponentProps): ReactNode {
	switch (statusCode) {
		case RedirectType.PERMANENT:
			permanentRedirect(destination);
			break;
		case RedirectType.TEMPORARY:
			redirect(destination);
			break;
		default:
			throw new Error('invalid statusCode ' + statusCode);
	}
	return <div />;
}
