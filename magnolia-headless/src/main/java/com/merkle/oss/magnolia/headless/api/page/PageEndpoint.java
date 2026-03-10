package com.merkle.oss.magnolia.headless.api.page;

import info.magnolia.config.registry.DefinitionProvider;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.repository.RepositoryConstants;

import java.lang.invoke.MethodHandles;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapper;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapperResolver;
import com.merkle.oss.magnolia.headless.model.RedirectModelDataProvider;
import com.merkle.oss.magnolia.powernode.PowerNode;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/headless")
public class PageEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final SiteManager siteManager;
    private final TemplateDefinitionRegistry templateDefinitionRegistry;
    private final RedirectModelDataProvider redirectModelDataProvider;
    private final ErrorPageProvider errorPageProvider;
    private final Gson gson;
    private final PageNodeResolver pageNodeResolver;
    private final PagePathMapperResolver pagePathMapperResolver;
    private final PageModelProvider pageModelProvider;

    @Inject
    public PageEndpoint(
            final SiteManager siteManager,
            final TemplateDefinitionRegistry templateDefinitionRegistry,
            final RedirectModelDataProvider redirectModelDataProvider,
            final ErrorPageProvider errorPageProvider,
            final GsonBuilder gsonBuilder,
            final PageNodeResolver pageNodeResolver,
            final PagePathMapperResolver pagePathMapperResolver,
            final PageModelProvider pageModelProvider
    ) {
        this.siteManager = siteManager;
        this.templateDefinitionRegistry = templateDefinitionRegistry;
		this.redirectModelDataProvider = redirectModelDataProvider;
        this.errorPageProvider = errorPageProvider;
        this.gson = gsonBuilder.create();
		this.pageNodeResolver = pageNodeResolver;
        this.pagePathMapperResolver = pagePathMapperResolver;
        this.pageModelProvider = pageModelProvider;
    }

    @Path("/{language}/page")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Response page(
            @Context final HttpServletRequest request,
            @PathParam(value = "language") final String language, //is picked up by info.magnolia.cms.i18n.HierarchyBasedI18nContentSupport
            @QueryParam(value = "path") final String path,
            @QueryParam(value = "workspace") @DefaultValue(RepositoryConstants.WEBSITE) final String workspace,
            @QueryParam(value = "domain") final String domain,
            @Nullable @QueryParam(value = "version") final String versionName,
            @Nullable @QueryParam(value = "selectedComponentVariants") final String selectedComponentVariants, //is picked up by com.merkle.powerboost.web.core.templates.JsonRenderer
            @Nullable @QueryParam(value = "variants") final String variants
    ) {
        try {
            @Nullable
            final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            final Locale locale = Locale.forLanguageTag(language);
            return getPageResponse(locale, site, path, workspace, versionName, request);
        } catch (Exception e) {
            LOG.error("Failed to serve page response!", e);
            return Response.serverError().build();
        }
    }

    @Path("/{language}/error-page")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response errroPage(
            @PathParam(value = "language") final String language, //is picked up by info.magnolia.cms.i18n.HierarchyBasedI18nContentSupport
            @QueryParam(value = "domain") final String domain,
            @QueryParam(value = "errorCode") final int errorCode
    ) {
        try {
            @Nullable
            final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            final Locale locale = Locale.forLanguageTag(language);
            return getErrorPageResponse(locale, site, errorCode);
        } catch (Exception e) {
            LOG.error("Failed to serve error page response!", e);
            return Response.serverError().build();
        }
    }

    private Response getErrorPageResponse(final Locale locale, final Site site, final int errorCode) {
        return getPageResponse(locale, errorPageProvider.get(locale, site, errorCode).orElse(null), true);
    }

    private Response getPageResponse(final Locale locale, final Site site, final String path, final String workspace, @Nullable final String versionName, final HttpServletRequest request) {
        final PagePathMapper.Result result = pagePathMapperResolver.resolve(locale, site, path, workspace, versionName, request);
        return result.getRedirect()
                .map(redirectResult ->
                        getRedirectResponse(redirectResult.destination(), redirectResult.redirectStatusCode())
                )
                .or(() -> result.getPath().map(pathResult ->
                      getPageResponse(locale, pageNodeResolver.getPageNode(site, pathResult.workspace(), pathResult.path(), versionName).orElse(null), false)
                ))
                .orElseThrow(() ->
                    new IllegalStateException("either redirect or path must be present!")
                );
    }

    private Response getPageResponse(final Locale locale, @Nullable final PowerNode page, final boolean errorPage) {
        return Optional
                .ofNullable(page)
                .map(p ->  getRenderResponseBody(locale, page, errorPage))
                .map(body -> Response.ok(body).build())
                .orElseGet(() -> Response.status(Response.Status.NOT_FOUND).build());
    }

    protected String getRenderResponseBody(final Locale locale, final PowerNode page, final boolean errorPage) {
        final TemplateDefinition template = page.getTemplate().map(templateDefinitionRegistry::getProvider).map(DefinitionProvider::get).orElseThrow(() ->
                new NullPointerException("couldn't get template for page: " + page.getPath())
        );
        return serialize(pageModelProvider.get(page, template));
    }
    protected String serialize(final Map<String, Object> model) {
        return gson.toJson(model);
    }

	private Response getRedirectResponse(final String destination, final int redirectStatusCode) {
		return Response.ok(getRedirectResponseBody(
			redirectModelDataProvider.get(destination, redirectStatusCode)
		)).build();
	}
	private String getRedirectResponseBody(final RedirectModelDataProvider.RedirectModel redirectModel) {
		return gson.toJson(redirectModel);
	}
}
