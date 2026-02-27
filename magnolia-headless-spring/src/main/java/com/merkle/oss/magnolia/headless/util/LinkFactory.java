package com.merkle.oss.magnolia.headless.util;

import info.magnolia.module.site.Site;

import java.util.Locale;

public interface LinkFactory {
    String createInternalLink(Locale locale, Site site, String path);
    String toExternalLink(String internalLink, Site site);
}
