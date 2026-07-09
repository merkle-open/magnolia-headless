package com.merkle.oss.magnolia.headless.api.sitemap;

import java.util.Set;

import org.apache.commons.text.StringEscapeUtils;

public class SitemapXmlFormatter {
	private static final String NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";

	public String format(final Set<SitemapProvider.Url> sitemapUrls) {
		final StringBuilder xml = new StringBuilder();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		xml.append("<urlset xmlns=\"").append(NAMESPACE).append("\">");
		for (final SitemapProvider.Url url : sitemapUrls) {
			xml.append("<url>");
			appendElement(xml, "loc", url.loc());
			appendElement(xml, "lastmod", url.lastmod());
			appendElement(xml, "changefreq", url.changefreq());
			appendElement(xml, "priority", url.priority());
			xml.append("</url>");
		}
		xml.append("</urlset>");
		return xml.toString();
	}

	private static void appendElement(final StringBuilder xml, final String name, final String value) {
		if (value == null || value.isBlank()) {
			return;
		}
		xml.append('<').append(name).append('>')
				.append(StringEscapeUtils.escapeXml10(value))
				.append("</").append(name).append('>');
	}
}
