package com.merkle.oss.magnolia.headless.api.sitemap;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

class SitemapXmlFormatterTest {
    private SitemapXmlFormatter formatter;

    @BeforeEach
    void setUp() {
        formatter = new SitemapXmlFormatter();
    }

    @Test
    void test() throws JsonProcessingException {
        assertEquals(
                "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://site.com/de/somepage</loc><lastmod>2026-07-03T11:02:10.083+02:00</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url></urlset>",
                formatter.format(Set.of(new SitemapProvider.Url(
                        "https://site.com/de/somepage",
                        "2026-07-03T11:02:10.083+02:00",
                        "weekly",
                        "0.5"
                )))
        );
    }
}
