package com.merkle.oss.magnolia.headless.api;

import static org.junit.jupiter.api.Assertions.assertEquals;

import info.magnolia.cms.util.UnicodeNormalizer;
import info.magnolia.init.MagnoliaConfigurationProperties;
import info.magnolia.jcr.util.NodeNameHelper;
import info.magnolia.test.TestMagnoliaConfigurationProperties;
import info.magnolia.test.junit5.ComponentProviderSupport;
import info.magnolia.test.junit5.MagnoliaTest;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

@MagnoliaTest
class DefaultPathValidatorTest {
    private PathValidator.DefaultPathValidator defaultPathValidator;

    @BeforeEach
    void setUp(final ComponentProviderSupport componentProviderSupport) throws IOException {
        componentProviderSupport.setImplementation(UnicodeNormalizer.Normalizer.class, UnicodeNormalizer.AutoDetectNormalizer.class);

        defaultPathValidator = new PathValidator.DefaultPathValidator(new NodeNameHelper(new TestMagnoliaConfigurationProperties(
                MagnoliaConfigurationProperties.MAGNOLIA_UTF8_ENABLED, "true"
        )));
    }

    @ParameterizedTest
    @CsvSource(value = {
            "/some:true",
            "/some/path:true",
            "/some/path:true",
            "/some/path/test-ing:true",
            "/some/path/testing42:true",
            "/some/path/tesTing:true",
            "/some/path1' AND 1=1 UNION SELECT NULL--:false",
            "/some/path/@@test:false",
            "/some/path/../test:false",
    }, delimiter = ':')
    void validatePath(final String path, final String expectedValid) {
        assertEquals(Boolean.parseBoolean(expectedValid), defaultPathValidator.isValid(path));
    }
}
