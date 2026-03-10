package com.merkle.oss.magnolia.headless.api.robots;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.merkle.oss.magnolia.headless.api.sitemap.SitemapEndpoint;
import com.merkle.oss.magnolia.headless.util.LinkFactory;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
public class RobotsTxtEndpoint {
	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private final RobotsTextProvider robotsTextProvider;
	private final SiteManager siteManager;
    private final SitemapEndpoint sitemapController;
	private final LinkFactory linkFactory;

	@Inject
	public RobotsTxtEndpoint(
			final RobotsTextProvider robotsTextProvider,
			final SiteManager siteManager,
			final LinkFactory linkFactory,
			final SitemapEndpoint sitemapController
	) {
		this.robotsTextProvider = robotsTextProvider;
		this.siteManager = siteManager;
        this.sitemapController = sitemapController;
		this.linkFactory = linkFactory;
	}

	@ApiResponses(value = {
			@ApiResponse(responseCode="200", description = "Robots txt for crawler"),
			@ApiResponse(responseCode="500", description = "Internal Server Error"),
			@ApiResponse(responseCode="404", description = "Not Found")
	})
	@Path("robots")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public Response robots(
			@Context final HttpServletRequest request,
			@QueryParam(value = "domain") final String domain,
			@QueryParam(value = "sitemapUrlTemplate") @Parameter(name = "sitemapUrlTemplate", description = "url template with language placeholder", example = "/api/{language}/seo/sitemap.xml") final String sitemapUrlTemplate
	) {
		try {
			@Nullable final Site site = siteManager.getAssignedSite(domain, "");
			if (site == null) {
				return Response.status(Response.Status.BAD_REQUEST).build();
			}

			final String robots = Stream
					.concat(
							robotsTextProvider.get(request, site).stream(),
							sitemapUrlStream(request, site, sitemapUrlTemplate)
					)
					.collect(Collectors.joining("\n"));
			if (StringUtils.isNotEmpty(robots)) {
				return Response.ok(robots).build();
			}
			return Response.status(Response.Status.NOT_FOUND).build();
		} catch (Exception e) {
			LOG.error("Failed to serve robot.txt response!", e);
			return Response.serverError().build();
		}
	}

	private Stream<String> sitemapUrlStream(final HttpServletRequest request, final Site site, final String sitemapUrlTemplate) {
		return sitemapController.streamSitemapEndpoints(request, site, sitemapUrlTemplate)
				.map(path -> linkFactory.toExternalLink(path, site))
				.map(sitemapLink -> "Sitemap: " + sitemapLink);
	}
}
