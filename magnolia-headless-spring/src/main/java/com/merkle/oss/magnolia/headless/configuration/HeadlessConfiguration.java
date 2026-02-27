package com.merkle.oss.magnolia.headless.configuration;

import info.magnolia.cms.beans.config.ServerConfiguration;
import info.magnolia.cms.core.version.VersionManager;
import info.magnolia.i18nsystem.LocaleProvider;
import info.magnolia.lock.PathLockManager;
import info.magnolia.module.site.SiteManager;
import info.magnolia.objectfactory.Components;
import info.magnolia.personalization.variant.VariantManager;
import info.magnolia.rendering.engine.RenderingEngine;
import info.magnolia.rendering.spa.renderer.AreaNodeGenerator;
import info.magnolia.rendering.template.assignment.TemplateDefinitionAssignment;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.rendering.template.variation.RenderableVariationResolver;
import info.magnolia.templating.module.TemplatingModule;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Scope;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.merkle.oss.magnolia.headless.api.dynamicresponseheader.DynamicResponseHeaderProvider;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapper;
import com.merkle.oss.magnolia.headless.api.robots.RobotsTextProvider;
import com.merkle.oss.magnolia.headless.api.sitemap.SitemapProvider;
import com.merkle.oss.magnolia.headless.api.vanity.VanityProvider;
import com.merkle.oss.magnolia.headless.renderer.JsonRenderer;
import com.merkle.oss.magnolia.renderer.spring.MagnoliaTemplateView;

@ComponentScan(
        basePackages = {"com.merkle.oss.magnolia.headless"},
        includeFilters = {
                @ComponentScan.Filter(Component.class),
                @ComponentScan.Filter(Service.class),
        }
)
public class HeadlessConfiguration {

    @Bean
    public MagnoliaTemplateView.Resolver viewResolver() {
        return new MagnoliaTemplateView.Resolver(JsonRenderer.class, MediaType.APPLICATION_JSON_VALUE);
    }

    @Bean
    public List<PagePathMapper> pagePathMappers() {
        return Collections.emptyList();
    }

    @Bean
    public Set<DynamicResponseHeaderProvider> dynamicResponseHeaderProviders() {
        return Collections.emptySet();
    }

    @Bean
    public Set<SitemapProvider> sitemapProviders() {
        return Collections.emptySet();
    }

    @Bean
    public VanityProvider vanityProvider() {
        return (locale, site, path) -> Optional.empty();
    }

    @Bean
    public RobotsTextProvider robotsTextProvider() {
        return (request, site) -> Optional.empty();
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public JsonRenderer jsonRenderer() {
        return Components.getComponent(JsonRenderer.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public SiteManager siteManager() {
        return Components.getComponent(SiteManager.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public RenderingEngine renderingEngine() {
        return Components.getComponent(RenderingEngine.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public VersionManager versionManager() {
        return Components.getComponent(VersionManager.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public VariantManager variantManager() {
        return Components.getComponent(VariantManager.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public RenderableVariationResolver renderableVariationResolver() {
        return Components.getComponent(RenderableVariationResolver.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public TemplateDefinitionAssignment templateDefinitionAssignment() {
        return Components.getComponent(TemplateDefinitionAssignment.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public TemplateDefinitionRegistry templateDefinitionRegistry() {
        return Components.getComponent(TemplateDefinitionRegistry.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public TemplatingModule templatingModule() {
        return Components.getComponent(TemplatingModule.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public PathLockManager pathLockManager() {
        return Components.getComponent(PathLockManager.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public AreaNodeGenerator areaNodeGenerator() {
        return Components.getComponent(AreaNodeGenerator.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public ServerConfiguration serverConfiguration() {
        return Components.getComponent(ServerConfiguration.class);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public LocaleProvider localeProvider() {
        return Components.getComponent(LocaleProvider.class);
    }
}
