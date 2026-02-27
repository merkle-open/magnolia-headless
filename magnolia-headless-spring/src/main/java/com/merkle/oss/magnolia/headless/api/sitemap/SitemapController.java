package com.merkle.oss.magnolia.headless.api.sitemap;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.text.StringSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class SitemapController {
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final SitemapXmlFormatter sitemapXmlFormatter;
    private final SiteManager siteManager;
    private final Map<String, SitemapProvider> typeSitemapProviderMapping;

    @Inject
    public SitemapController(
            final SitemapXmlFormatter sitemapXmlFormatter,
            final SiteManager siteManager,
            final Set<SitemapProvider> sitemapProviders
    ) {
        this.sitemapXmlFormatter = sitemapXmlFormatter;
        this.siteManager = siteManager;
        this.typeSitemapProviderMapping = sitemapProviders.stream().collect(Collectors.toMap(
                SitemapProvider::getType,
                Function.identity()
        ));
    }

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sitemap"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @GetMapping(value = "/{language}/seo/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap(
            final HttpServletRequest request,
            @PathVariable(name = "language") final String language,
            @RequestParam(name = "type") final String type,
            @RequestParam(name = "domain") final String domain
    ){
        try {
            final Locale locale = Locale.forLanguageTag(language);
            @Nullable final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return ResponseEntity.badRequest().build();
            }
            final Set<SitemapProvider.Url> sitemapUrls = typeSitemapProviderMapping.get(type).stream(request, locale, site).collect(Collectors.toSet());
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.APPLICATION_XML)
                    .body(sitemapXmlFormatter.format(sitemapUrls));
        } catch (Exception e) {
            LOG.error("Failed to serve sitemap response!", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    public Stream<String> streamSitemapEndpoints(final HttpServletRequest request, final Site site, final String sitemapUrlTemplate) {
        return typeSitemapProviderMapping.values().stream().flatMap(provider ->
                site.getI18n().getLocales().stream().flatMap(locale ->
                        Optional
                                .of(provider)
                                .filter(Predicate.not(SitemapProvider::excludeFromRobots))
                                .filter(sitemapProvider -> sitemapProvider.stream(request, locale, site).findAny().isPresent())
                                .map(sitemapProvider -> getSitemapEndpoint(sitemapProvider.getType(), locale, sitemapUrlTemplate))
                                .stream()
                )
        );
    }

    private String getSitemapEndpoint(final String type, final Locale locale, final String sitemapUrlTemplate) {
        final StringSubstitutor substitutor = new StringSubstitutor(Map.of(
                "language", locale.getLanguage(),
                "type", type
        ), "{", "}");
        return substitutor.replace(sitemapUrlTemplate);
    }
}
