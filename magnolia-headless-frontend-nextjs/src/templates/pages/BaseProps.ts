import { MgnlContent } from '@magnolia/frontend-helpers-base';

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

export interface MetaProps {
	seoTitle: string;
	description: string;
	keywords: string[];
	robots?: string;
	canonical: string;
	openGraph: OpenGraph;
	hrefLangLinks: HrefLangLink[];
	favicons?: {
		favicon?: string;
		faviconLegacy?: string;
		appleTouchIcon?: string;
	};
}

export default interface Props extends MgnlContent {
	meta: MetaProps;
	theme?: string;
}
