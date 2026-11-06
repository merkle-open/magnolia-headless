import { MgnlContent } from '@magnolia/frontend-helpers-base';
import { DependencyContainer } from 'tsyringe';

export default interface Props extends MgnlContent {
	container: DependencyContainer;
}
