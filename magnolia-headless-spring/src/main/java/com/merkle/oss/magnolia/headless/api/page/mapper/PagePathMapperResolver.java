package com.merkle.oss.magnolia.headless.api.page.mapper;

import info.magnolia.module.site.Site;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Component;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;

@Component("MagnoliaHeadlessSpring-PagePathMapperResolver")
public class PagePathMapperResolver {
    private final List<PagePathMapper> pagePathMappers;

    @Inject
    public PagePathMapperResolver(final List<PagePathMapper> pagePathMappers) {
        this.pagePathMappers = pagePathMappers;
    }

    public PagePathMapper.Result resolve(final Locale locale, final Site site, final String path, final String workspace, @Nullable final String versionName, final HttpServletRequest request){
        return map(pagePathMappers, locale, site, path, workspace, versionName, request);
    }

    private PagePathMapper.Result map(final List<PagePathMapper> pagePathMappers, final Locale locale, final Site site, final String path, final String workspace, @Nullable final String versionName, final HttpServletRequest request){
        if(!pagePathMappers.isEmpty()) {
            final PagePathMapper.Result result = pagePathMappers.get(0).map(locale, site, path, workspace, versionName, request);
            return result.getPath().map(pathResult ->
                    map(pagePathMappers.stream().skip(1).toList(), locale, site, pathResult.path(), pathResult.workspace(), versionName, request)
            ).orElse(result);
        }
        return new PagePathMapper.Result(new PagePathMapper.Path(path, workspace));
    }
}
