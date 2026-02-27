package com.merkle.oss.magnolia.headless.api.sitemap;

import info.magnolia.module.site.Site;

import java.util.Locale;
import java.util.stream.Stream;

import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;

public interface SitemapProvider {
    Stream<Url> stream(HttpServletRequest request, Locale locale, Site site);
    String getType();
    default boolean excludeFromRobots() {
        return false;
    }

    record Url(
            String loc,
            @Nullable
            String lastmod,
            @Nullable
            String changefreq,
            @Nullable
            String priority
    ) {}
}
