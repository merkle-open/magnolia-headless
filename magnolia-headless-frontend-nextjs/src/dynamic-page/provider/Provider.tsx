import { ReactNode } from 'react';
import { inject, injectable, injectAllWithTransform } from 'tsyringe';
import { token } from '../../Constants.ts';
import { Logger } from '../../helper/Logger.ts';
// @ts-expect-error: tsyringe missing exports prevents ESM resolution with 'nodenext'.
import { Transform } from 'tsyringe/dist/typings/types/index.d.ts';

export interface Props {
	childrenProvider: () => ReactNode;
}
export interface ContextProvider {
	render(props: Props): Promise<ReactNode>;
	getOrder(): number;
	getName(): string;
}

export const CONTEXT_PROVIDER_TOKEN = token('ContextProvider');

class ProviderTransform implements Transform<ContextProvider[], ContextProvider[]> {
	public transform(providers: ContextProvider[]): ContextProvider[] {
		return providers.sort((p1, p2) => p1.getOrder() - p2.getOrder());
	}
}

@injectable()
export class ComposedContextProvider {
	constructor(
		@injectAllWithTransform(CONTEXT_PROVIDER_TOKEN, ProviderTransform) private readonly providers: ContextProvider[],
		@inject(Logger) private readonly logger: Logger,
	) {}

	public async render(props: Props): Promise<ReactNode> {
		return this.renderProvider(this.providers, props);
	}

	private async renderProvider(providers: ContextProvider[], props: Props) {
		if (providers.length > 0) {
			const [provider, ...rest] = providers;
			return this.renderProviderSafe(provider, props).then((rendered) =>
				this.renderProvider(rest, {
					childrenProvider: () => rendered,
				}),
			);
		}
		return Promise.resolve(props.childrenProvider());
	}

	private async renderProviderSafe(provider: ContextProvider, props: Props): Promise<ReactNode> {
		try {
			return provider.render(props);
		} catch (e) {
			this.logger.error(`failed to render provider ${provider.getName()} with order:${provider.getOrder()}, skipping... error: ${e}`);
			return Promise.resolve(props.childrenProvider());
		}
	}
}
