import { inject, injectable } from 'tsyringe';
import { type HeadlessConfigProviderI, HEADLESS_CONFIG_PROVIDER_TOKEN, ThemesProvider } from '../config/ConfigProvider.ts';
import { Logger } from './Logger.ts';

@injectable()
export class ThemeValidator {
	private readonly themesProvider: ThemesProvider;

	constructor(
		@inject(HEADLESS_CONFIG_PROVIDER_TOKEN) configProvider: HeadlessConfigProviderI,
		@inject(Logger) private readonly logger: Logger,
	) {
		this.themesProvider = configProvider.get().themesProvider;
	}

	public getValidatedTheme(theme?: string): string {
		if (!theme || !this.themesProvider.getAll().includes(theme)) {
			if (theme) {
				this.logger.error(`Got invalid theme '${theme}' from magnolia! falling back to ${this.themesProvider.getFallback()}`);
			}
			return this.themesProvider.getFallback();
		}
		return theme;
	}
}
