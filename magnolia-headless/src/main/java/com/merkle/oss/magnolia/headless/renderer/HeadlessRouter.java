package com.merkle.oss.magnolia.headless.renderer;

import info.magnolia.cms.i18n.I18nContentSupport;
import info.magnolia.context.Context;
import info.magnolia.module.site.Domain;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;
import info.magnolia.pages.spa.routing.SiteAwareSpaRouter;
import info.magnolia.rendering.spa.renderer.SiteAwareSpaRenderableDefinition;
import info.magnolia.rendering.spa.renderer.SpaRenderableDefinition;
import info.magnolia.repository.RepositoryConstants;

import java.net.URL;
import java.util.Collection;
import java.util.Optional;
import java.util.function.Predicate;

import javax.jcr.Node;

import com.machinezoo.noexception.Exceptions;

import jakarta.inject.Inject;

public class HeadlessRouter extends SiteAwareSpaRouter {
    private final SiteManager siteManager;

    @Inject
    public HeadlessRouter(
            final SpaRenderableDefinition definition,
            final I18nContentSupport i18nContentSupport,
            final SiteManager siteManager
    ) {
        super(getSiteAwareSpaRenderableDefinition(definition), i18nContentSupport, siteManager);
        this.siteManager = siteManager;
    }

    private static SiteAwareSpaRenderableDefinition getSiteAwareSpaRenderableDefinition(final SpaRenderableDefinition spaRenderableDefinition) {
        final SiteAwareSpaRenderableDefinition definition = new SiteAwareSpaRenderableDefinition(spaRenderableDefinition::getTemplateAvailability);
        definition.setBaseUrl(spaRenderableDefinition.getBaseUrl());
        definition.setRouteTemplate(spaRenderableDefinition.getRouteTemplate());
        return definition;
    }

    @Override
    public Optional<URL> makeRoute(final Node pageNode, final Context context) {
        return getBaseUrl(pageNode, context).map(baseUrl ->
                makeRouteURL(pageNode, context, baseUrl, getDefinition().getRouteTemplate())
        );
    }

    @Override
    public Optional<URL> getBaseUrl(final Node pageNode, final Context context) {
        return Optional.ofNullable(siteManager.getAssignedSite(pageNode))
                .map(Site::getDomains).stream().flatMap(Collection::stream).findFirst()
                .map(Domain::toString)
                .flatMap(this::createURL);
    }

    @Override
    protected Optional<String> getValue(final String propName, final Node node, final Context context, final boolean encodeValue) {
        if ("workspace".equals(propName)) {
            return Optional.of(Exceptions.wrap().get(() -> node.getSession().getWorkspace().getName())).filter(Predicate.not(RepositoryConstants.WEBSITE::equals));
        }
        return super.getValue(propName, node, context, encodeValue);
    }
}
