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

import com.merkle.oss.magnolia.headless.util.Lazy;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.inject.Provider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/headless")
public class SitemapEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final SitemapXmlFormatter sitemapXmlFormatter;
    private final SiteManager siteManager;
    private final Provider<Map<String, SitemapProvider>> typeSitemapProviderMapping;

    @Inject
    public SitemapEndpoint(
            final SitemapXmlFormatter sitemapXmlFormatter,
            final SiteManager siteManager,
            final Provider<Set<SitemapProvider>> sitemapProviders
    ) {
        this.sitemapXmlFormatter = sitemapXmlFormatter;
        this.siteManager = siteManager;
        this.typeSitemapProviderMapping = Lazy.of(() -> sitemapProviders.get().stream().collect(Collectors.toMap(
                SitemapProvider::getType,
                Function.identity()
        )))::get;
    }

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sitemap"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    @Path("/{language}/seo/sitemap")
    @GET
    @Produces(MediaType.APPLICATION_XML)
    public Response sitemap(
            @Context final HttpServletRequest request,
            @PathParam(value = "language") final String language,
            @QueryParam(value = "type") final String type,
            @QueryParam(value = "domain") final String domain
    ){
        try {
            final Locale locale = Locale.forLanguageTag(language);
            @Nullable final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            final Set<SitemapProvider.Url> sitemapUrls = typeSitemapProviderMapping.get().get(type).stream(request, locale, site).collect(Collectors.toSet());
            return Response.ok(sitemapXmlFormatter.format(sitemapUrls)).build();
        } catch (Exception e) {
            LOG.error("Failed to serve sitemap response!", e);
            return Response.serverError().build();
        }
    }

    public Stream<String> streamSitemapEndpoints(final HttpServletRequest request, final Site site, final String sitemapUrlTemplate) {
        return typeSitemapProviderMapping.get().values().stream().flatMap(provider ->
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
