// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
// @ts-expect-error: Next.js missing exports prevents ESM resolution with 'nodenext'.
import type { Twitter } from 'next/dist/lib/metadata/types/twitter-types';
import { MetaProps, OpenGraph as HeadlessOpenGraph } from '../templates/pages/BaseProps.ts';
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
			...(meta.favicons && {
				icons: {
					icon: [
						meta.favicons.faviconLegacy && { url: meta.favicons.faviconLegacy, sizes: '32x32' },
						meta.favicons.favicon && { url: meta.favicons.favicon, type: 'image/svg+xml' },
					].filter(Boolean),
					apple: [meta.favicons.appleTouchIcon && { url: meta.favicons.appleTouchIcon, sizes: '180x180' }].filter(Boolean),
				},
			}),
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
