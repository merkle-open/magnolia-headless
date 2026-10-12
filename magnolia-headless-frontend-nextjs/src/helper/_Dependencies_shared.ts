import { DependencyContainer } from 'tsyringe';
import { ResponseHelper } from './RestClient.ts';
import { MagnoliaContextProvider } from './MagnoliaContextProvider.ts';
import { ThemeValidator } from './ThemeValidator.ts';
import { Logger } from './Logger.ts';

export default function register(container: DependencyContainer) {
	container.register(Logger, { useClass: Logger });
	container.register(ResponseHelper, { useClass: ResponseHelper });
	container.register(MagnoliaContextProvider, { useClass: MagnoliaContextProvider });
	container.register(ThemeValidator, { useClass: ThemeValidator });
}
