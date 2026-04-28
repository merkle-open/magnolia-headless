package com.merkle.oss.magnolia.headless.api.templateannotation;

import info.magnolia.cms.beans.config.ServerConfiguration;
import info.magnolia.config.registry.DefinitionProvider;
import info.magnolia.context.MgnlContext;
import info.magnolia.context.WebContext;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.lock.PathLockManager;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.SiteManager;
import info.magnolia.personalization.variant.VariantManager;
import info.magnolia.rendering.engine.OutputProvider;
import info.magnolia.rendering.engine.RenderingEngine;
import info.magnolia.rendering.spa.renderer.AnnotationRenderingEngine;
import info.magnolia.rendering.spa.renderer.AreaNodeGenerator;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.assignment.TemplateDefinitionAssignment;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;
import info.magnolia.rendering.template.variation.RenderableVariationResolver;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.templating.elements.AbstractContentTemplatingElement;
import info.magnolia.templating.elements.AreaElement;
import info.magnolia.templating.elements.ComponentElement;
import info.magnolia.templating.elements.PageElement;
import info.magnolia.templating.elements.TemplatingElement;
import info.magnolia.templating.module.TemplatingModule;

import java.io.OutputStream;
import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.machinezoo.noexception.Exceptions;
import com.merkle.oss.magnolia.powernode.PowerNode;
import com.merkle.oss.magnolia.powernode.PowerNodeService;
import com.merkle.oss.magnolia.powernode.predicate.magnolia.IsArea;
import com.merkle.oss.magnolia.powernode.predicate.magnolia.IsComponent;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.inject.Provider;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/headless")
public class TemplateAnnotationEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private static final String OPENING_TAG = "<!-- ";
    private static final String CLOSING_TAG = " -->\n";

    private final SiteManager siteManager;
    private final PowerNodeService powerNodeService;
    private final AnnotationRenderingEngine renderingEngine;
    private final TemplateDefinitionAssignment templateDefinitionAssignment;
    private final TemplateDefinitionRegistry templateDefinitionRegistry;
    private final Provider<TemplatingModule> templatingModuleProvider;
    private final ServerConfiguration serverConfiguration;
    private final RenderableVariationResolver variationResolver;
    private final Provider<WebContext> contextProvider;
    private final PathLockManager lockManager;
    private final AreaNodeGenerator areaNodeGenerator;
    private final VariantManager variantManager;
    private final Gson gson;

    @Inject
    public TemplateAnnotationEndpoint(
            final SiteManager siteManager,
            final PowerNodeService powerNodeService,
            final RenderingEngine renderingEngine,
            final TemplateDefinitionAssignment templateDefinitionAssignment,
            final TemplateDefinitionRegistry templateDefinitionRegistry,
            final Provider<TemplatingModule> templatingModuleProvider,
            final ServerConfiguration serverConfiguration,
            final RenderableVariationResolver variationResolver,
            final PathLockManager lockManager,
            final AreaNodeGenerator areaNodeGenerator,
            final VariantManager variantManager,
            final GsonBuilder gsonBuilder
    ) {
        this.siteManager = siteManager;
        this.powerNodeService = powerNodeService;
        this.renderingEngine = new AnnotationRenderingEngine(renderingEngine::getRenderingContext);
        this.templateDefinitionAssignment = templateDefinitionAssignment;
        this.templateDefinitionRegistry = templateDefinitionRegistry;
        this.templatingModuleProvider = templatingModuleProvider;
        this.serverConfiguration = serverConfiguration;
        this.variationResolver = variationResolver;
        this.contextProvider = MgnlContext::getWebContext;
        this.lockManager = lockManager;
        this.areaNodeGenerator = areaNodeGenerator;
        this.variantManager = variantManager;
        this.gson = gsonBuilder.create();
    }

    @Path("templateAnnotations")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response templateAnnotations(
            @QueryParam(value = "path") final String path,
            @QueryParam(value = "workspace") @DefaultValue(RepositoryConstants.WEBSITE) final String workspace,
            @QueryParam(value = "domain") final String domain
    ) {
        try {
            @Nullable
            final Site site = siteManager.getAssignedSite(domain, "");
            if (site == null) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            final PowerNode node = powerNodeService.getByPath(workspace, path).orElse(null);
            if(node == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            areaNodeGenerator.createAreaNodes(node);
            return Response.ok(gson.toJson(getTemplateAnnotations(node))).build();
        } catch (Exception e) {
            LOG.error("Failed to serve page response!", e);
            return Response.serverError().build();
        }
    }

    private Map<String, String> getTemplateAnnotations(final PowerNode node) {
        return streamTemplateAnnotationEntries(node)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private Stream<Map.Entry<String, String>> streamTemplateAnnotationEntries(final PowerNode node) {
        return streamTemplateNodes(node).flatMap(templateNode -> Stream.concat(
                getTemplateAnnotationEntries(templateNode).stream(),
                streamAllVariants(templateNode).flatMap(this::streamTemplateAnnotationEntries)
        ));
    }

    private Optional<Map.Entry<String, String>> getTemplateAnnotationEntries(final PowerNode templateNode) {
        try {
            return getTemplateDefinition(templateNode).map(definition ->
                    Map.entry(templateNode.getPath(), renderAnnotations(templateNode, definition))
            );
        } catch (Exception e) {
            LOG.error("Failed to getTemplateAnnotationEntries for "+templateNode.getPath()+", skipping", e);
            return Optional.empty();
        }
    }

    private Stream<PowerNode> streamTemplateNodes(final PowerNode node) {
        return Stream.concat(
                Stream.of(node),
                streamChildrenRecursive(node, new IsArea<PowerNode>().or(new IsComponent<>()))
        );
    }

    private Stream<PowerNode> streamAllVariants(final PowerNode node) {
        return StreamSupport.stream(Exceptions.wrap().get(() -> variantManager.getAllVariants(node)).spliterator(), false).map(powerNodeService::convertToPowerNode);
    }

    private Stream<PowerNode> streamChildrenRecursive(final PowerNode node, final Predicate<PowerNode> predicate) {
        return node.streamChildren(predicate).flatMap(areaOrComponent ->
                Stream.concat(
                        Stream.of(areaOrComponent),
                        streamChildrenRecursive(areaOrComponent, predicate)
                )
        );
    }

    private Stream<PowerNode> streamAncestorsAndSelf(final PowerNode node, final Predicate<PowerNode> predicate) {
        return Stream.of(node).filter(predicate).flatMap(filteredNode ->
                Stream.concat(
                        Stream.of(filteredNode),
                        filteredNode.getParentOptional().stream().flatMap(parent -> streamAncestorsAndSelf(parent, predicate))
                )
        );
    }

    private Optional<TemplateDefinition> getTemplateDefinition(final PowerNode content) {
        final PowerNode currentNode = content.getAncestorOrSelf(new IsArea<PowerNode>().negate()).orElseThrow(() ->
            new NullPointerException("current node not present!")
        );
        final List<String> parentAreaNames = streamAncestorsAndSelf(content, new IsArea<>()).skip(1).map(PowerNode::getName).toList();
        return getAssignedTemplateDefinition(currentNode)
                .map(definition ->
                        parentAreaNames.isEmpty() ? definition : definition.getAreas().get(parentAreaNames.get(parentAreaNames.size() - 1))
                )
                .flatMap(definition -> {
                    if (new IsArea<>().test(content) && !definition.getAreas().containsKey(content.getName())) {
                        return Optional.empty();
                    }
                    return Optional.of(definition);
                });
    }

    private String renderAnnotations(final PowerNode node, final TemplateDefinition definition) {
        contextProvider.get().getAggregationState().setPreviewMode(false);
        final StringBuilder outputBuilder = new StringBuilder();
        try {
            renderingEngine.getRenderingContext().push(node, definition, new OutputProvider() {
                @Override
                public Appendable getAppendable() {
                    return outputBuilder;
                }
                @Override
                public OutputStream getOutputStream() {
                    return null;
                }
            });
            final TemplatingElement contentElement = createTemplatingElement(node);
            contentElement.begin(outputBuilder);
            return unwrapComment(outputBuilder.toString());
        } catch (Exception e) {
            throw new RuntimeException("Failed to render template annotation for node " + node, e);
        }
    }

    private String unwrapComment(final String htmlComment) {
        if (StringUtils.isEmpty(htmlComment)) {
            return htmlComment;
        }
        String annotation = htmlComment.substring(OPENING_TAG.length());
        annotation = annotation.substring(0, annotation.indexOf(CLOSING_TAG));
        return annotation;
    }

    protected Optional<TemplateDefinition> getAssignedTemplateDefinition(final PowerNode node) {
        return node.getTemplate()
                .map(templateDefinitionRegistry::getProvider)
                .filter(DefinitionProvider::isValid)
                .map(DefinitionProvider::get);
    }

    private TemplatingElement createTemplatingElement(final PowerNode node) {
        final AbstractContentTemplatingElement contentElement = createTemplatingElement(node, contextProvider.get());
        contentElement.setContent(node);
        contentElement.setWorkspace(node.getSession().getWorkspace().getName());
        contentElement.setNodeIdentifier(node.getIdentifier());
        contentElement.setPath(node.getPath());
        return contentElement;
    }

    private AbstractContentTemplatingElement createTemplatingElement(final PowerNode node, final WebContext webContext) {
        switch (node.getPrimaryNodeType().getName()) {
        case NodeTypes.Page.NAME:
            return new PageElement(serverConfiguration, renderingEngine.getRenderingContext(), templatingModuleProvider, webContext);
        case NodeTypes.Area.NAME:
            final AreaElement areaElement = new AreaElement(serverConfiguration, renderingEngine.getRenderingContext(), renderingEngine, variationResolver, templatingModuleProvider, webContext, lockManager);
            areaElement.setName(node.getName());
            return areaElement;
        case NodeTypes.Component.NAME:
            return new ComponentElement(serverConfiguration, renderingEngine.getRenderingContext(), renderingEngine, templateDefinitionAssignment, webContext, templatingModuleProvider);
        default:
            throw new IllegalArgumentException("Unsupported node type: " + node.getPrimaryNodeType().getName());
        }
    }
}
