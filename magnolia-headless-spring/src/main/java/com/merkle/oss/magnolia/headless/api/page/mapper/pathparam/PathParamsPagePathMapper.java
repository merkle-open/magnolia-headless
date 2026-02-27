package com.merkle.oss.magnolia.headless.api.page.mapper.pathparam;

import info.magnolia.module.site.Site;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapper;
import com.merkle.oss.magnolia.headless.util.LinkFactory;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;

public class PathParamsPagePathMapper implements PagePathMapper {
    public static final String REQUEST_ATTRIBUTE_PREFIX = "PathParamsRequestAttribute_";

    private final PathParamsLinkBuilder.Parser pathParamsLinkBuilderParser;
    private final LinkFactory linkFactory;

    public PathParamsPagePathMapper(
            final PathParamsLinkBuilder.Parser pathParamsLinkBuilderParser,
            final LinkFactory linkFactory
    ) {
        this.pathParamsLinkBuilderParser = pathParamsLinkBuilderParser;
        this.linkFactory = linkFactory;
    }

    @Override
    public Result map(final Locale locale, final Site site, final String path, final String workspace, @Nullable final String versionName, final HttpServletRequest request) {
        final PathParamsLinkBuilder pathParamsLinkBuilder = pathParamsLinkBuilderParser.parse(path);
        final String orderedUrl = pathParamsLinkBuilder.build();
        if (!Objects.equals(orderedUrl, path)) {
            return new Result(new Redirect(
                    UriComponentsBuilder
                            .fromPath(linkFactory.createInternalLink(locale, site, orderedUrl))
                            .query(URLDecoder.decode(request.getQueryString(), StandardCharsets.UTF_8))
                            .toUriString(),
                    301
            ));
        }
        pathParamsLinkBuilder.getParameters().forEach((key, values) ->
                request.setAttribute(REQUEST_ATTRIBUTE_PREFIX + key, values)
        );
        return new Result(new Path(
                pathParamsLinkBuilder.getBaseUrl(),
                workspace
        ));
    }

    @Component("MagnoliaHeadlessSpring-PathParamsPagePathMapper.Factory")
    public static class Factory {
        private final PathParamsLinkBuilder.Parser.Factory pathParamsLinkBuilderParserFactory;
        private final LinkFactory linkFactory;

        @Inject
        public Factory(
                final PathParamsLinkBuilder.Parser.Factory pathParamsLinkBuilderParserFactory,
                final LinkFactory linkFactory
        ) {
            this.pathParamsLinkBuilderParserFactory = pathParamsLinkBuilderParserFactory;
            this.linkFactory = linkFactory;
        }

        public PathParamsPagePathMapper create(final List<String> parameterKeys) {
            return new PathParamsPagePathMapper(
                    pathParamsLinkBuilderParserFactory.create(parameterKeys),
                    linkFactory
            );
        }
    }
}
