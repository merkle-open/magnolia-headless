package com.merkle.oss.magnolia.headless.api.sitemap;

import java.util.Collection;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

public class SitemapXmlFormatter {

	public String format(final Set<SitemapProvider.Url> sitemapUrls) throws JsonProcessingException {
		return new XmlMapper()
				.setSerializationInclusion(JsonInclude.Include.NON_EMPTY)
				.writeValueAsString(new UrlSet(sitemapUrls));
	}

	@JacksonXmlRootElement(localName = "urlset", namespace = "http://www.sitemaps.org/schemas/sitemap/0.9")
	private record UrlSet(
			@JacksonXmlElementWrapper(useWrapping = false)
			@JacksonXmlProperty(localName = "url")
			Collection<? extends SitemapProvider.Url> urls
	) {}
}
