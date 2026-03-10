package com.merkle.oss.magnolia.headless.api.page.mapper.pathparam;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import com.merkle.oss.magnolia.headless.util.LinkUtil;

class PathParamsLinkBuilderTest {
    private PathParamsLinkBuilder.Parser parser;

    @BeforeEach
    void setUp() {
        parser = new PathParamsLinkBuilder.Parser(new LinkUtil(), List.of("aPathParam2", "pathParam1"));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/de/some-page",
            "/de/some-page/pathParam1",
            "/de/some-page/pathParam1/",
            "/de/some-page/aPathParam2",
            "/de/some-page/aPathParam2/",
            "/de/some-page/pathParam1/aPathParam2",
            "/de/some-page/pathParam1/aPathParam2/"
    })
    void parse_shouldReturnBaseLink(final String link) {
        assertEquals(
                "/de/some-page",
                parser.parse(link).build()
        );
    }

    @Test
    void pares_paramListEmpty_shouldReturnOriginalLink() {
        final PathParamsLinkBuilder.Parser parser = new PathParamsLinkBuilder.Parser(new LinkUtil(), Collections.emptyList());
        assertEquals(
                "/de/some-page",
                parser.parse("/de/some-page").build()
        );
    }


    @ParameterizedTest
    @ValueSource(strings = {
            "/de/some-page/pathParam1/aTag/bTag/cTag",
            "/de/some-page/pathParam1/cTag/bTag/aTag",
            "/de/some-page/pathParam1/cTag/aTag/bTag"
    })
    void parse_params_shouldReturnBaseLinkWithSortedParams(final String link) {
        assertEquals(
                "/de/some-page/pathParam1/aTag/bTag/cTag",
                parser.parse(link).build()
        );
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/de/some-page/pathParam1/aTag/bTag/cTag/aPathParam2/value2",
            "/de/some-page/pathParam1/cTag/bTag/aTag/aPathParam2/value2",
            "/de/some-page/pathParam1/cTag/aTag/bTag/aPathParam2/value2",
            "/de/some-page/aPathParam2/value2/pathParam1/aTag/bTag/cTag",
            "/de/some-page/aPathParam2/value2/pathParam1/cTag/bTag/aTag",
            "/de/some-page/aPathParam2/value2/pathParam1/cTag/aTag/bTag"
    })
    void parse_multipleParams_shouldReturnBaseLinkWithSortedParams(final String link) {
        assertEquals(
                "/de/some-page/aPathParam2/value2/pathParam1/aTag/bTag/cTag",
                parser.parse(link).build()
        );
    }

    @Test
    void parse_params_anchor_shouldReturnBaseLinkWithSortedParamsAndAnchor() {
        assertEquals(
                "/de/some-page/pathParam1/aTag/bTag/cTag#anchor",
                parser.parse("/de/some-page/pathParam1/aTag/bTag/cTag#anchor").build()
        );
    }

    @Test
    void parse_anchor_setParams_shouldReturnBaseLinkWithSortedParamsAndAnchor() {
        assertEquals(
                "/de/some-page/pathParam1/aTag/bTag/cTag#anchor",
                parser.parse("/de/some-page#anchor")
                        .param("pathParam1", Set.of("aTag", "bTag", "cTag"))
                        .build()
        );
    }
}
