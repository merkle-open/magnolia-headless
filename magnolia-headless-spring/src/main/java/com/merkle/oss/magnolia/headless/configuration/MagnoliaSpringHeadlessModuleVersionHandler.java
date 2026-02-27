package com.merkle.oss.magnolia.headless.configuration;

import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.Task;
import info.magnolia.module.model.Version;

import java.util.List;

import jakarta.inject.Inject;

public class MagnoliaSpringHeadlessModuleVersionHandler extends DefaultModuleVersionHandler {
	private final InstallJsonRendererSetupTask installJsonRendererSetupTask;

	@Inject
	public MagnoliaSpringHeadlessModuleVersionHandler(final InstallJsonRendererSetupTask installJsonRendererSetupTask) {
		this.installJsonRendererSetupTask = installJsonRendererSetupTask;
	}

	@Override
	protected final List<Task> getExtraInstallTasks(final InstallContext installContext) { // when module node does not exist
		return List.of(installJsonRendererSetupTask);
	}

	@Override
	protected final List<Task> getDefaultUpdateTasks(final Version forVersion) { //on every module update
		return List.of(installJsonRendererSetupTask);
	}
}
