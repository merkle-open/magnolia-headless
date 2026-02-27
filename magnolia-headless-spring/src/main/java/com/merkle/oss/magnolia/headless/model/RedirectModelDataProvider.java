package com.merkle.oss.magnolia.headless.model;

import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.util.Locale;

import org.springframework.stereotype.Component;
import org.springframework.ui.ExtendedModelMap;

import com.merkle.oss.magnolia.headless.util.LinkFactory;
import com.merkle.oss.magnolia.powernode.PowerNode;

import jakarta.inject.Inject;

@Component("MagnoliaHeadlessSpring-RedirectModelDataProvider")
public class RedirectModelDataProvider {
    private final SiteManager siteManager;
    private final LinkFactory linkFactory;

    @Inject
    public RedirectModelDataProvider(
            final SiteManager siteManager,
            final LinkFactory linkFactory
    ) {
        this.siteManager = siteManager;
        this.linkFactory = linkFactory;
    }

    public RedirectModel get(final Locale locale, final PowerNode destination, final int statusCode) {
        final Site site = siteManager.getAssignedSite(destination);
        return get(linkFactory.createInternalLink(locale, site, destination.getPath()), statusCode);
    }
    public RedirectModel get(final String destination, final int statusCode) {
        return new RedirectModel(
                destination,
                statusCode
        );
    }

    public static class RedirectModel extends ExtendedModelMap {
        public RedirectModel(final String destination, final int statusCode) {
            addAttribute(NodeTypes.Renderable.TEMPLATE, "merkle-open_magnolia-headless:__redirect");
            addAttribute("destination", destination);
            addAttribute("statusCode", statusCode);
        }
    }
}
