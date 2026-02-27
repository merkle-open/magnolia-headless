package com.merkle.oss.magnolia.headless.api.robots;

import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;

import java.lang.invoke.MethodHandles;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.merkle.oss.magnolia.headless.api.sitemap.SitemapController;
import com.merkle.oss.magnolia.headless.util.LinkFactory;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class RobotsTxtController {
	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private final RobotsTextProvider robotsTextProvider;
	private final SiteManager siteManager;
    private final SitemapController sitemapController;
	private final LinkFactory linkFactory;

	@Inject
	public RobotsTxtController(
			final RobotsTextProvider robotsTextProvider,
			final SiteManager siteManager,
			final LinkFactory linkFactory,
			final SitemapController sitemapController
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
	@GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	public ResponseEntity<String> robots(
			final HttpServletRequest request,
			@RequestParam(name = "domain") final String domain,
			@RequestParam(name = "sitemapUrlTemplate") @Parameter(name = "sitemapUrlTemplate", description = "url template with language placeholder", example = "/api/{language}/seo/sitemap.xml") final String sitemapUrlTemplate
	) {
		try {
			@Nullable final Site site = siteManager.getAssignedSite(domain, "");
			if (site == null) {
				return ResponseEntity.badRequest().build();
			}

			final String robots = Stream
					.concat(
							robotsTextProvider.get(request, site).stream(),
							sitemapUrlStream(request, site, sitemapUrlTemplate)
					)
					.collect(Collectors.joining("\n"));
			if (StringUtils.isNotEmpty(robots)) {
				return ResponseEntity
						.ok()
						.contentType(MediaType.TEXT_PLAIN)
						.body(robots);
			}
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			LOG.error("Failed to serve robot.txt response!", e);
			return ResponseEntity.internalServerError().build();
		}
	}

	private Stream<String> sitemapUrlStream(final HttpServletRequest request, final Site site, final String sitemapUrlTemplate) {
		return sitemapController.streamSitemapEndpoints(request, site, sitemapUrlTemplate)
				.map(path -> linkFactory.toExternalLink(path, site))
				.map(sitemapLink -> "Sitemap: " + sitemapLink);
	}
}
