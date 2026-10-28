package com.merkle.oss.magnolia.headless.api;

import info.magnolia.jcr.util.NodeNameHelper;

import jakarta.inject.Inject;

/**
 * Validates path to fail probing attempts early
 */
public interface PathValidator {
    boolean isValid(String path);
    class DefaultPathValidator implements PathValidator {
        private final NodeNameHelper nodeNameHelper;

        @Inject
        public DefaultPathValidator(final NodeNameHelper nodeNameHelper) {
            this.nodeNameHelper = nodeNameHelper;
        }

        @Override
        public boolean isValid(final String path) {
            return !path.contains("..") && nodeNameHelper.isValidName(path.replace("/", ""));
        }
    }
}
