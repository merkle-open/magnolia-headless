export interface HrefLangLink {
	language: string;
	href: string;
}

export interface OpenGraph {
	siteName?: string;
	title: string;
	description: string;
	url: string;
	image?: string;
}

export default interface MetaProps {
	seoTitle: string;
	description: string;
	keywords: string[];
	robots?: string;
	canonical: string;
	openGraph: OpenGraph;
	hrefLangLinks: HrefLangLink[];
	theme: string;
}
