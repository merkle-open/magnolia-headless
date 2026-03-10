package com.merkle.oss.magnolia.headless.api.dynamicresponseheader;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/headless")
public class DynamicResponseHeaderEndpoint {
	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private final SiteManager siteManager;
	private final Gson gson;
    private final Set<DynamicResponseHeaderProvider> dynamicResponseHeaderProviders;

    @Inject
    public DynamicResponseHeaderEndpoint(
		final SiteManager siteManager,
		final GsonBuilder gsonBuilder,
		final Set<DynamicResponseHeaderProvider> dynamicResponseHeaderProviders
	) {
        this.siteManager = siteManager;
		this.gson = gsonBuilder.create();
        this.dynamicResponseHeaderProviders = dynamicResponseHeaderProviders;
    }

	@Path("/dynamic/response-header")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
    public Response cspHeaders(
			@Context final HttpServletRequest request,
			@QueryParam(value = "domain") final String domain
	) {
		try {
			@Nullable final Site site = siteManager.getAssignedSite(domain, "");
			if (site == null) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			}

			final Map<String, String> headers = dynamicResponseHeaderProviders.stream()
					.flatMap(provider -> provider.stream(request, site))
					.collect(Collectors.toMap(
							DynamicResponseHeaderProvider.Header::key,
							DynamicResponseHeaderProvider.Header::value
					));
			return Response.ok(gson.toJson(headers)).build();
		} catch (Exception e) {
			LOG.error("Failed to serve dynamicResponseHeader response!", e);
			return Response.serverError().build();
		}
    }
}
