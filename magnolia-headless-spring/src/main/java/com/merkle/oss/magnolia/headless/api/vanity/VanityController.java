package com.merkle.oss.magnolia.headless.api.vanity;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.Locale;

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

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;

@RestController
public class VanityController {
	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private final SiteManager siteManager;
	private final Gson gson;
	private final VanityProvider vanityProvider;

	@Inject
	public VanityController(
		final SiteManager siteManager,
		final GsonBuilder gsonBuilder,
		final VanityProvider vanityProvider
	) {
		this.siteManager = siteManager;
		this.gson = gsonBuilder.create();
		this.vanityProvider = vanityProvider;
	}

	@ApiResponses(value = {@ApiResponse(responseCode = "200", description = "pages")})
	@GetMapping(value = "/{language}/vanity.json", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> page(
		@RequestParam(name = "path") final String path,
		@RequestParam(name = "domain") final String domain,
		@PathVariable(name = "language") final String language
	) {
		try {
			@Nullable
			final Site site = siteManager.getAssignedSite(domain, "");
			if (site == null) {
				return ResponseEntity.badRequest().build();
			}
			final Locale locale = Locale.forLanguageTag(language);
			return vanityProvider
				.getVanity(locale, site, path)
				.map(vanity ->
					ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(gson.toJson(vanity))
				)
				.orElseGet(() ->
					ResponseEntity.notFound().build()
				);
		} catch (Exception e) {
			LOG.error("Failed to serve vanity response!", e);
			return ResponseEntity.internalServerError().build();
		}
	}
}
