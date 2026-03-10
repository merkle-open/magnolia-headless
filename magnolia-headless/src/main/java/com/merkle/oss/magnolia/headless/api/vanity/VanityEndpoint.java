package com.merkle.oss.magnolia.headless.api.vanity;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/headless")
public class VanityEndpoint {
	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private final SiteManager siteManager;
	private final Gson gson;
	private final VanityProvider vanityProvider;

	@Inject
	public VanityEndpoint(
		final SiteManager siteManager,
		final GsonBuilder gsonBuilder,
		final VanityProvider vanityProvider
	) {
		this.siteManager = siteManager;
		this.gson = gsonBuilder.create();
		this.vanityProvider = vanityProvider;
	}

	@ApiResponses(value = {@ApiResponse(responseCode = "200", description = "pages")})
	@Path("{language}/vanity")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response page(
		@PathParam(value = "language") final String language,
		@QueryParam(value = "path") final String path,
		@QueryParam(value = "domain") final String domain
	) {
		try {
			@Nullable
			final Site site = siteManager.getAssignedSite(domain, "");
			if (site == null) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			}
			final Locale locale = Locale.forLanguageTag(language);
			return vanityProvider
				.getVanity(locale, site, path)
				.map(vanity ->
						Response.ok(gson.toJson(vanity)).build()
				)
				.orElseGet(() ->
					Response.status(Response.Status.NOT_FOUND).build()
				);
		} catch (Exception e) {
			LOG.error("Failed to serve vanity response!", e);
			return Response.serverError().build();
		}
	}
}
