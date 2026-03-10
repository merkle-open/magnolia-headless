package com.merkle.oss.magnolia.headless.renderer;

import info.magnolia.rendering.context.RenderingContext;
import info.magnolia.rendering.engine.RenderException;
import info.magnolia.rendering.renderer.Renderer;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.rendering.util.AppendableWriter;

import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang3.Strings;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.view.AbstractTemplateView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.merkle.oss.magnolia.powernode.PowerNode;
import com.merkle.oss.magnolia.powernode.PowerNodeService;

import jakarta.inject.Inject;

public class JsonRenderer implements Renderer {
	public static final String NAME = "json";

    private final PowerNodeService powerNodeService;
    private final Gson gson;

	@Inject
	public JsonRenderer(
			final PowerNodeService powerNodeService,
			final GsonBuilder gsonBuilder
	) {
        this.powerNodeService = powerNodeService;
        this.gson = gsonBuilder.create();
    }

	@Override
	public void render(final RenderingContext ctx, final Map<String, Object> contextObjects) throws RenderException {
        try {
        	final AppendableWriter out = ctx.getAppendable();
        	out.append(serialize(filter(contextObjects)));
        } catch (Exception e) {
			final PowerNode node = powerNodeService.convertToPowerNode(ctx.getCurrentContent());
			final RenderableDefinition renderableDefinition = ctx.getRenderableDefinition();
			throw new RenderException("Failed to render " + node.getPath() + "," + renderableDefinition.getId(), e);
		}
	}

	protected Map<String, Object> filter(final Map<String, Object> model) {
		return model.entrySet().stream()
				.filter(entry -> !Strings.CS.startsWith(entry.getKey(), BindingResult.MODEL_KEY_PREFIX))
				.filter(entry -> !Objects.equals(entry.getKey(), AbstractTemplateView.SPRING_MACRO_REQUEST_CONTEXT_ATTRIBUTE))
				.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
	}

	protected String serialize(final Map<String, Object> model) {
		return gson.toJson(model);
	}
}
