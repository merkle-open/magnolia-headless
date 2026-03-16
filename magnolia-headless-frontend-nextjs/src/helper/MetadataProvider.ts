// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import type { Twitter } from 'next/dist/lib/metadata/types/twitter-types';
import MetaProps, { OpenGraph as HeadlessOpenGraph } from './MetaProps.ts';
import { Metadata } from 'next';
import { injectable } from 'tsyringe';

@injectable()
export class MetadataProvider {
	public getMetadata(meta: MetaProps): Metadata {
		if (meta == undefined) {
			return {};
		}
		return {
			title: meta.seoTitle,
			description: meta.description,
			keywords: meta.keywords,
			robots: meta.robots,
			applicationName: meta.openGraph?.siteName,
			openGraph: this.getOpenGraph(meta.openGraph),
			twitter: this.getTwitter(meta.openGraph),
			alternates: {
				canonical: meta.canonical,
				languages: Object.fromEntries(meta.hrefLangLinks.map((link) => [link.language, link.href])),
			},
		};
	}

	private getOpenGraph(openGraph: HeadlessOpenGraph): OpenGraph {
		return {
			url: openGraph.url,
			title: openGraph.title,
			description: openGraph.description,
			siteName: openGraph.siteName,
			images: [
				{
					url: openGraph.image,
				},
			],
		};
	}

	private getTwitter(openGraph: HeadlessOpenGraph): Twitter {
		return {
			card: 'summary_large_image',
			title: openGraph?.title,
			description: openGraph?.description,
			images: [
				{
					url: openGraph?.image,
				},
			],
		};
	}
}
