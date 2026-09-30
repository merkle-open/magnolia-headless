package com.merkle.oss.magnolia.headless.api.templateannotation;

import info.magnolia.cms.beans.config.ServerConfiguration;
import info.magnolia.cms.security.operations.OperationPermissionDefinition;
import info.magnolia.context.WebContext;
import info.magnolia.rendering.context.RenderingContext;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.rendering.template.configured.ConfiguredTemplateDefinition;
import info.magnolia.templating.elements.ComponentElement;
import info.magnolia.templating.elements.MarkupHelper;
import info.magnolia.templating.module.TemplatingModule;

import java.io.IOException;

import jakarta.inject.Inject;
import jakarta.inject.Provider;

public class ErrorComponentElement extends ComponentElement {
    private ConfiguredTemplateDefinition template;

    @Inject
    public ErrorComponentElement(
            final ServerConfiguration server,
            final RenderingContext renderingContext,
            final WebContext webContext,
            final Provider<TemplatingModule> templatingModuleProvider
    ) {
        super(server, renderingContext, null, null, webContext, templatingModuleProvider);
        this.template = new ConfiguredTemplateDefinition();
        template.setTitle("Error");
        template.setDeletable(true);
        template.setMoveable(true);
        template.setVisible(false);
        template.setEditable(false);
        template.setWritable(false);
    }

    @Override
    public void begin(final Appendable out) throws IOException {
        if (renderComments()) { // add condition into renderComments() method when adding extra condition to make sure it's in sync with adding comments in end() method
            final MarkupHelper helper = new MarkupHelper(out);
            helper.openComment(ComponentElement.CMS_COMPONENT_TAG);
            super.setPageEditorAttributes(helper, "component");
            helper.append(" -->\n");
        }
    }

    @Override
    public void end(final Appendable out) throws IOException {
        if (renderComments()) { // add condition into renderComments() method when adding extra condition to make sure it's in sync with adding comments in begin() method
            new MarkupHelper(out).closeComment(ComponentElement.CMS_COMPONENT_TAG);
        }
    }

    @Override
    protected boolean renderComments() {
        return super.renderComments() && !getWebContext().getAggregationState().isPreviewMode();
    }

    @Override
    public TemplateDefinition getTemplateDefinition() {
        return template;
    }

    @Override
    public OperationPermissionDefinition getPermissions() {
        return null;
    }
}
