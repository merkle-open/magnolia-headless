export interface MagnoliaApiEndpointsProvider {
	annotationTemplates(): string;
	pageContent(language: string): string;
	errorPageContent(language: string): string;
	dynamicResponseHeader(): string;
	vanity(language: string): string;
	robots(): string;
	sitemap(language: string): string;
}

export interface FrontendApiEndpointsProvider {
	errorPage(language: string): string;
}

export interface ThemesProvider {
	getFallback(): string;
	getAll(): string[];
}

export type Credentials = {
	username: string;
	password: string;
};

export type Config = {
	magnoliaCredentials: Credentials;
	multiTree: boolean;
	magnoliaApisProvider: MagnoliaApiEndpointsProvider;
	frontendApisProvider: FrontendApiEndpointsProvider;
	themesProvider: ThemesProvider;
};

export interface HeadlessConfigProviderI {
	get(): Config;
}
