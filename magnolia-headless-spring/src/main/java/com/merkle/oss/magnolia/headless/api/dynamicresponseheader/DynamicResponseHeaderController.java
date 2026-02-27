package com.merkle.oss.magnolia.headless.api.dynamicresponseheader;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class DynamicResponseHeaderController {
	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private final SiteManager siteManager;
	private final Gson gson;
    private final Set<DynamicResponseHeaderProvider> dynamicResponseHeaderProviders;

    @Inject
    public DynamicResponseHeaderController(
		final SiteManager siteManager,
		final GsonBuilder gsonBuilder,
		final Set<DynamicResponseHeaderProvider> dynamicResponseHeaderProviders
	) {
        this.siteManager = siteManager;
		this.gson = gsonBuilder.create();
        this.dynamicResponseHeaderProviders = dynamicResponseHeaderProviders;
    }

    @GetMapping(value = "/dynamic/response-header.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> cspHeaders(
			final HttpServletRequest request,
			@RequestParam(name = "domain") final String domain
	) {
		try {
			@Nullable final Site site = siteManager.getAssignedSite(domain, "");
			if (site == null) {
				return ResponseEntity.badRequest().build();
			}

			final Map<String, String> headers = dynamicResponseHeaderProviders.stream()
					.flatMap(provider -> provider.stream(request, site))
					.collect(Collectors.toMap(
							DynamicResponseHeaderProvider.Header::key,
							DynamicResponseHeaderProvider.Header::value
					));
			return ResponseEntity
					.ok()
					.contentType(MediaType.APPLICATION_JSON)
					.body(gson.toJson(headers));
		} catch (Exception e) {
			LOG.error("Failed to serve dynamicResponseHeader response!", e);
			return ResponseEntity.internalServerError().build();
		}
    }
}
