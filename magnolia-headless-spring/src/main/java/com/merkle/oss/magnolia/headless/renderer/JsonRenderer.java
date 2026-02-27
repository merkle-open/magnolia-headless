package com.merkle.oss.magnolia.headless.renderer;

import info.magnolia.cms.core.version.VersionedNode;
import info.magnolia.config.registry.DefinitionProvider;
import info.magnolia.jcr.inheritance.InheritanceContentDecorator;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.jcr.util.NodeUtil;
import info.magnolia.objectfactory.Components;
import info.magnolia.rendering.context.RenderingContext;
import info.magnolia.rendering.engine.AppendableOnlyOutputProvider;
import info.magnolia.rendering.engine.RenderException;
import info.magnolia.rendering.engine.RenderingEngine;
import info.magnolia.rendering.generator.Generator;
import info.magnolia.rendering.renderer.Renderer;
import info.magnolia.rendering.template.AreaDefinition;
import info.magnolia.rendering.template.AutoGenerationConfiguration;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.rendering.util.AppendableWriter;
import info.magnolia.templating.inheritance.DefaultInheritanceContentDecorator;

import java.lang.invoke.MethodHandles;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.jcr.Node;

import org.apache.commons.lang3.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.view.AbstractTemplateView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.machinezoo.noexception.Exceptions;
import com.merkle.oss.magnolia.powernode.PowerNode;
import com.merkle.oss.magnolia.powernode.PowerNodeService;
import com.merkle.oss.magnolia.powernode.predicate.magnolia.IsComponent;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;

public class JsonRenderer implements Renderer {
	public static final String NAME = "json";

	private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
	private static final String META_PROPERTY_PREFIX = "@";
	private static final String PATH_PROPERTY = META_PROPERTY_PREFIX + "path";
	private static final String NAME_PROPERTY = META_PROPERTY_PREFIX + "name";
	private static final String CHILD_PROPERTY = META_PROPERTY_PREFIX + "nodes";
	private static final String UUID_PROPERTY = META_PROPERTY_PREFIX + "id";
	private static final String NODE_TYPE_PROPERTY = META_PROPERTY_PREFIX + "nodeType";

	private final Gson gson;
	private final RenderingEngine renderingEngine;
	private final PowerNodeService powerNodeService;
	private final TemplateDefinitionRegistry templateDefinitionRegistry;

	@Inject
	public JsonRenderer(
		final RenderingEngine renderingEngine,
		final PowerNodeService powerNodeService,
		final TemplateDefinitionRegistry templateDefinitionRegistry,
		final GsonBuilder gsonBuilder
	) {
		this.renderingEngine = renderingEngine;
		this.powerNodeService = powerNodeService;
		this.templateDefinitionRegistry = templateDefinitionRegistry;
		this.gson = gsonBuilder.create();
	}

	@Override
	public void render(final RenderingContext ctx, final Map<String, Object> contextObjects) throws RenderException {
		try {
			final PowerNode content = powerNodeService.convertToPowerNode(ctx.getCurrentContent());
			final TemplateDefinition templateDefinition = (TemplateDefinition) ctx.getRenderableDefinition();
			final AppendableWriter out = ctx.getAppendable();
			final Map<String, Object> outputModel = new HashMap<>(
				contextObjects
					.entrySet().stream()
					.filter(entry -> !Strings.CS.startsWith(entry.getKey(), BindingResult.MODEL_KEY_PREFIX))
					.filter(entry -> !Objects.equals(entry.getKey(), AbstractTemplateView.SPRING_MACRO_REQUEST_CONTEXT_ATTRIBUTE))
					.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
			);

			outputModel.put(NAME_PROPERTY, content.getName());
			outputModel.put(PATH_PROPERTY, content.getPath());
			outputModel.put(UUID_PROPERTY, content.getIdentifier());
			outputModel.put(NODE_TYPE_PROPERTY, content.getPrimaryNodeType().getName());
			outputModel.put(CHILD_PROPERTY, templateDefinition.getAreas().keySet());
			if (!outputModel.containsKey(NodeTypes.Renderable.TEMPLATE)) {
				content.getTemplate().ifPresent(template ->
					outputModel.put(NodeTypes.Renderable.TEMPLATE, template)
				);
			}

			for (Map.Entry<String, AreaDefinition> entry : templateDefinition.getAreas().entrySet()) {
				@Nullable final PowerNode area = getArea(content, entry.getKey(), entry.getValue())
					.map(a -> addInheritanceWrapper(content, a, entry.getValue()))
					.orElse(null);
				if (area != null) {
					final Map<String, Object> areaModel = render(area, entry.getValue());
					outputModel.put(entry.getKey(), areaModel);

					final List<PowerNode> components = area.streamChildren(new IsComponent<>()).toList();
					for (final PowerNode component : components) {
						@Nullable
						final TemplateDefinition componentTemplateDefinition = getTemplateDefinition(component).orElse(null);
						if (componentTemplateDefinition != null) {
							areaModel.put(component.getName(), render(component, componentTemplateDefinition));
						} else {
							areaModel.put(component.getName(), Collections.emptyMap());
						}
					}
					areaModel.put(CHILD_PROPERTY, components.stream().map(PowerNode::getName).collect(Collectors.toList()));
				}
			}
			out.append(serialize(outputModel));
		} catch (final Exception e) {
			throw new RenderException("Failed to render template", e);
		}
	}

	protected String serialize(final Map<String, Object> model) {
		return gson.toJson(model);
	}

	private Optional<TemplateDefinition> getTemplateDefinition(final PowerNode component) {
		try {
			return component.getTemplate().map(templateDefinitionRegistry::getProvider).map(DefinitionProvider::get);
		} catch (final Exception e) {
			LOG.error("Failed to get template definition for component " + component.getPath(), e);
			return Optional.empty();
		}
	}

	private PowerNode addInheritanceWrapper(final PowerNode content, final PowerNode area, final AreaDefinition areaDefinition) {
		if(areaDefinition.getInheritance() != null) {
			// See info.magnolia.templating.elements.AreaElement line 185
			final DefaultInheritanceContentDecorator decorator = Exceptions.wrap().get(() -> new DefaultInheritanceContentDecorator(area, areaDefinition.getInheritance()));
			final Node wrappedArea = decorator.wrapNode(area);
			final boolean isDirectChild = area.getPath().startsWith(content.getPath());
			if (InheritanceContentDecorator.DestinationNodeInheritanceNodeWrapper.class.isAssignableFrom(wrappedArea.getClass())) {
				((InheritanceContentDecorator.DestinationNodeInheritanceNodeWrapper) wrappedArea).setEvaluateChildren(!isDirectChild);
			}
			return powerNodeService.convertToPowerNode(wrappedArea);
		}
		return area;
	}

	// see info.magnolia.rendering.spa.renderer.AreaNodeGenerator
	private Optional<PowerNode> getArea(final PowerNode node, final String name, final AreaDefinition areaDefinition) {
		if (Boolean.FALSE.equals(areaDefinition.getCreateAreaNode()) || NodeUtil.isWrappedWith(node, VersionedNode.class)) {
			return node.getChild(name);
		}
		return node
			.toSystemSession()
			.map(systemSessionNode -> systemSessionNode.getOrAddChild(name, NodeTypes.Area.NAME))
			.map(n -> {
				triggerAutoGeneration(n, areaDefinition);
				Exceptions.wrap().run(() -> n.getSession().save());
				return n;
			})
			.flatMap(PowerNode::toUserSession);
	}

	private void triggerAutoGeneration(final PowerNode area, final AreaDefinition areaDefinition) {
		final AutoGenerationConfiguration<?> autoGeneration = areaDefinition.getAutoGeneration();
		if (autoGeneration != null && autoGeneration.getGeneratorClass() != null) {
			final Generator<AutoGenerationConfiguration> generator = Components.newInstance(autoGeneration.getGeneratorClass(), area);
			Exceptions.wrap().run(() -> generator.generate(autoGeneration));
		}
	}

	protected Map<String, Object> render(final PowerNode content, final RenderableDefinition definition) throws RenderException {
		final StringBuilder areaBuilder = new StringBuilder();
		renderingEngine.render(content, definition, new HashMap<>(), new AppendableOnlyOutputProvider(areaBuilder));
		return gson.fromJson(areaBuilder.toString(), Map.class);
	}
}
