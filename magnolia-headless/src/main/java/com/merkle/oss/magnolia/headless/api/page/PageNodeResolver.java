package com.merkle.oss.magnolia.headless.api.page;

import info.magnolia.cms.core.version.VersionManager;
import info.magnolia.module.site.Site;

import java.util.Optional;

import com.machinezoo.noexception.Exceptions;
import com.merkle.oss.magnolia.powernode.PowerNode;
import com.merkle.oss.magnolia.powernode.PowerNodeService;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;

public class PageNodeResolver {
	private final PowerNodeService powerNodeService;
	private final VersionManager versionManager;

	@Inject
	public PageNodeResolver(
			final PowerNodeService powerNodeService,
			final VersionManager versionManager
	) {
		this.powerNodeService = powerNodeService;
		this.versionManager = versionManager;
	}

	public Optional<PowerNode> getPageNode(final Site site, final String workspace, final String path, @Nullable final String versionName) {
		return Optional
			.ofNullable(site.getMappings().get(workspace))
			.map(mapping -> mapping.getHandle(path))
			.flatMap(handle ->
				powerNodeService.getByPath(workspace, handle)
			)
			.map(page ->
					Optional
							.ofNullable(versionName)
							.map(v -> Exceptions.wrap().get(() -> versionManager.getVersion(page, v)))
							.map(powerNodeService::convertToPowerNode)
							.orElse(page)
			);
	}
}
