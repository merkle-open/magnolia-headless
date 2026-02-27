package com.merkle.oss.magnolia.headless.api.page;

import info.magnolia.module.site.Site;

import java.util.Locale;
import java.util.Optional;

import com.merkle.oss.magnolia.powernode.PowerNode;

public interface ErrorPageProvider {
    /**
     * Returns a node of the page that should be rendered for the given errorCode.<br>
     * If empty is returned, the static error page defined in the frontend is rendered.
     */
    Optional<PowerNode> get(Locale locale, Site site, int errorCode);
}
