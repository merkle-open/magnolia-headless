package com.merkle.oss.magnolia.headless.model;

import info.magnolia.i18nsystem.LocaleProvider;
import info.magnolia.i18nsystem.TranslationService;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.templating.functions.TemplatingFunctions;

import java.text.MessageFormat;

import org.springframework.stereotype.Component;
import org.springframework.ui.ExtendedModelMap;

import com.merkle.oss.magnolia.powernode.PowerNode;

import jakarta.inject.Inject;

@Component("MagnoliaHeadlessSpring-ErrorModelDataProvider")
public class ErrorModelDataProvider {
	private final TranslationService translationService;
    private final TemplatingFunctions templatingFunctions;
    private final LocaleProvider localeProvider;

    @Inject
	public ErrorModelDataProvider(
			final TranslationService translationService,
			final TemplatingFunctions templatingFunctions,
			final LocaleProvider localeProvider
	) {
		this.translationService = translationService;
        this.templatingFunctions = templatingFunctions;
        this.localeProvider = localeProvider;
    }

	public ErrorModel get(final String errorMsgKey, final PowerNode node, final Exception e) {
		return get(errorMsgKey, node, false, e);
	}
	public ErrorModel get(final String errorMsgKey, final PowerNode node, final boolean throwNotEditMode, final Exception e) {
		final MessageFormat fmt = new MessageFormat(getLabel(errorMsgKey, node));
		final String msg = fmt.format(new Object[]{e.getMessage()});
		return new ErrorModel(
			msg,
			node.getPath(),
			isAuthorMode(),
			throwNotEditMode
		);
	}

	private boolean isAuthorMode() {
		return !(templatingFunctions.isPublicInstance() || templatingFunctions.isPreviewMode());
	}

	protected String getLabel(final String key, final PowerNode node) {
		return translationService.translate(localeProvider, new String[]{key});
	}

	public static class ErrorModel extends ExtendedModelMap {
		public ErrorModel(final String message, final String path, final boolean editMode, final boolean throwNotEditMode) {
			addAttribute(NodeTypes.Renderable.TEMPLATE, "merkle-open_magnolia-headless:__error");
			addAttribute("msg", message);
			addAttribute("path", path);
			addAttribute("editMode", editMode);
			addAttribute("throwNotEditMode", throwNotEditMode);
		}
	}
}
