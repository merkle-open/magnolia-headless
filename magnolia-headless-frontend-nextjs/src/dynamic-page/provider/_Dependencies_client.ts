import { DependencyContainer } from 'tsyringe';
import registerShared from './_Dependencies_shared.ts';

export default function register(container: DependencyContainer) {
	registerShared(container);
}
