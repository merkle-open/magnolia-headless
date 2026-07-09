package com.merkle.oss.magnolia.headless.api.sitemap;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

class SitemapXmlFormatterTest {

    @Test
    void formatKeepsSitemapElementsInTheSitemapNamespace() throws Exception {
        final SitemapXmlFormatter formatter = new SitemapXmlFormatter();
        final String xml = formatter.format(Set.of(
                new SitemapProvider.Url(
                        "https://example.com/news/2024/06/security-update",
                        "2024-06-12T11:02:10.083+02:00",
                        null,
                        null
                )
        ));

        assertTrue(xml.contains("xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\""));
        assertFalse(xml.contains("xmlns=\"\""));
    }

    @Test
    void formatSkipsMissingOptionalFields() throws Exception {
        final SitemapXmlFormatter formatter = new SitemapXmlFormatter();
        final String xml = formatter.format(Set.of(
                new SitemapProvider.Url(
                        "https://example.com/jobs/apprenticeships",
                        null,
                        null,
                        null
                )
        ));

        assertTrue(xml.contains("<loc>https://example.com/jobs/apprenticeships</loc>"));
        assertFalse(xml.contains("<lastmod>"));
        assertFalse(xml.contains("<changefreq>"));
        assertFalse(xml.contains("<priority>"));
    }
}
