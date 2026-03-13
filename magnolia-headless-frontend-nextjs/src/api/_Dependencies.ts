import { DependencyContainer } from 'tsyringe';
import { ErrorPageApi } from './ErrorPageApi.ts';
import { RobotsTxtApi } from './RobotsTxtApi.ts';
import { SitemapApi } from './SitemapApi.ts';

export default function register(container: DependencyContainer) {
	container.register(ErrorPageApi, { useClass: ErrorPageApi });
	container.register(RobotsTxtApi, { useClass: RobotsTxtApi });
	container.register(SitemapApi, { useClass: SitemapApi });
}
