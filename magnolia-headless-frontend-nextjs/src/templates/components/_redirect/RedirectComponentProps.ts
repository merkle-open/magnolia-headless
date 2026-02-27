import BaseProps from '../BaseProps.ts';

export enum RedirectType {
	TEMPORARY = 302,
	PERMANENT = 301,
}

export default interface RedirectComponentProps extends BaseProps {
	destination: string;
	statusCode: RedirectType;
}
