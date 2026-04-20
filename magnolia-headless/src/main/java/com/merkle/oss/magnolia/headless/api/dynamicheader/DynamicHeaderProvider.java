package com.merkle.oss.magnolia.headless.api.dynamicheader;

import info.magnolia.module.site.Site;

import java.util.stream.Stream;

import jakarta.servlet.http.HttpServletRequest;

public interface DynamicHeaderProvider {
    Stream<Header> stream(HttpServletRequest request, Site site);

    record Header(String key, Value value){
        public Header(String key, String value) {
            this(key, value, Target.RESPONSE);
        }
        public Header(String key, String value, Target target) {
            this(key, new Value(value, target));
        }
        public record Value(String value, Target target){}
    }

    enum Target {
        REQUEST,
        RESPONSE,
        BOTH
    }
}
