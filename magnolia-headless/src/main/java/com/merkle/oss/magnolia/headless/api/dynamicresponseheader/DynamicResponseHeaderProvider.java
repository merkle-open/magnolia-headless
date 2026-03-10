package com.merkle.oss.magnolia.headless.api.dynamicresponseheader;

import info.magnolia.module.site.Site;

import java.util.stream.Stream;

import jakarta.servlet.http.HttpServletRequest;

public interface DynamicResponseHeaderProvider {
    Stream<Header> stream(HttpServletRequest request, Site site);

    record Header(String key, String value){}
}
