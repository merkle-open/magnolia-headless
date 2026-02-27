import { DependencyContainer } from 'tsyringe';
import { ErrorPageApi } from './ErrorPageApi.ts';
import { RobotsTxtApi } from './RobotsTxtApi.ts';
import { SitemapApi } from './SitemapApi.ts';

import { TOKEN_PREFIX } from '../Constants.ts';

export default function register(container: DependencyContainer) {
	container.register(TOKEN_PREFIX + 'ErrorPageApi', { useClass: ErrorPageApi });
	container.register(TOKEN_PREFIX + 'RobotsTxtApi', { useClass: RobotsTxtApi });
	container.register(TOKEN_PREFIX + 'SitemapApi', { useClass: SitemapApi });
}
