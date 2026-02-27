import { ErrorType } from '../../../helper/MagnoliaPageRestClient.ts';

export default interface ErrorStaticProps {
	errorType: ErrorType;
	language: string;
}
