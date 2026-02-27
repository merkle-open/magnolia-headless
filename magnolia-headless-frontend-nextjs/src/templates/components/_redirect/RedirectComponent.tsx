import { ReactNode } from 'react';
import { redirect, permanentRedirect } from 'next/navigation';
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
