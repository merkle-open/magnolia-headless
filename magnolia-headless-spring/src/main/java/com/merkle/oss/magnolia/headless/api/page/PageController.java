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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapper;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapperResolver;
import com.merkle.oss.magnolia.headless.model.RedirectModelDataProvider;
import com.merkle.oss.magnolia.powernode.PowerNode;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class PageController {
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
    public PageController(
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

    @GetMapping(value = "/{language}/page.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> page(
            final HttpServletRequest request,
            @RequestParam(name = "path") final String path,
            @RequestParam(name = "workspace", defaultValue = RepositoryConstants.WEBSITE) final String workspace,
            @RequestParam(name = "domain") final String domain,
            @Nullable @RequestParam(value = "version", required = false) final String versionName,
            @Nullable @RequestParam(value = "selectedComponentVariants", required = false) final String selectedComponentVariants, //is picked up by com.merkle.powerboost.web.core.templates.JsonRenderer
            @Nullable @RequestParam(value = "variants", required = false) final String variants,
            @PathVariable(name = "language") final String language //is picked up by info.magnolia.cms.i18n.HierarchyBasedI18nContentSupport
    ) {
        try {
            @Nullable
            final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return ResponseEntity.badRequest().build();
            }
            final Locale locale = Locale.forLanguageTag(language);
            return getPageResponse(locale, site, path, workspace, versionName, request);
        } catch (Exception e) {
            LOG.error("Failed to serve page response!", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(value = "/{language}/error-page.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> errroPage(
            @RequestParam(name = "domain") final String domain,
            @RequestParam(name = "errorCode") final int errorCode,
            @PathVariable(name = "language") final String language //is picked up by info.magnolia.cms.i18n.HierarchyBasedI18nContentSupport
    ) {
        try {
            @Nullable
            final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return ResponseEntity.badRequest().build();
            }
            final Locale locale = Locale.forLanguageTag(language);
            return getErrorPageResponse(locale, site, errorCode);
        } catch (Exception e) {
            LOG.error("Failed to serve error page response!", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private ResponseEntity<String> getErrorPageResponse(final Locale locale, final Site site, final int errorCode) {
        return getPageResponse(locale, errorPageProvider.get(locale, site, errorCode).orElse(null), true);
    }

    private ResponseEntity<String> getPageResponse(final Locale locale, final Site site, final String path, final String workspace, @Nullable final String versionName, final HttpServletRequest request) {
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

    private ResponseEntity<String> getPageResponse(final Locale locale, @Nullable final PowerNode page, final boolean errorPage) {
        return Optional
                .ofNullable(page)
                .map(p ->  getRenderResponseBody(locale, page, errorPage))
                .map(body -> ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(body))
                .orElseGet(() -> ResponseEntity.notFound().build());
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

	private ResponseEntity<String> getRedirectResponse(final String destination, final int redirectStatusCode) {
		return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(getRedirectResponseBody(
			redirectModelDataProvider.get(destination, redirectStatusCode)
		));
	}
	private String getRedirectResponseBody(final RedirectModelDataProvider.RedirectModel redirectModel) {
		return gson.toJson(redirectModel);
	}
}
