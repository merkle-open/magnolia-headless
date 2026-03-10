package com.merkle.oss.magnolia.headless.api.vanity;

import info.magnolia.module.site.Site;

import java.util.Locale;
import java.util.Optional;

public interface VanityProvider {
    Optional<Vanity> getVanity(Locale locale, Site site, String path);

    record Vanity(
            String destination,
            String type,
            boolean disableCache,
            boolean carryOverQueryParams
    ) {}

    class NoVanityProvider implements VanityProvider {
        @Override
        public Optional<Vanity> getVanity(Locale locale, Site site, String path) {
            return Optional.empty();
        }
    }
}
