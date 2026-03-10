package com.merkle.oss.magnolia.headless.api.page.mapper;

import info.magnolia.module.site.Site;

import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Can be used to map the page path / response. <br>
 * Ordered based on getOrder <br>
 * First one to return a redirect breaks the chain
 */
public interface PagePathMapper {
    Result map(Locale locale, Site site, String path, String workspace, @Nullable String versionName, HttpServletRequest request);
    int getOrder();

    class Result{
        @Nullable
        private final Path path;
        @Nullable
        private final Redirect redirect;

        public Result(final Path path) {
            this(path, null);
        }
        public Result(final Redirect redirect) {
            this(null, redirect);
        }
        private Result(@Nullable final Path path, @Nullable final Redirect redirect) {
            this.path = path;
            this.redirect = redirect;
        }

        public Optional<Path> getPath() {
            return Optional.ofNullable(path);
        }

        public Optional<Redirect> getRedirect() {
            return Optional.ofNullable(redirect);
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Result result)) {
                return false;
            }
            return Objects.equals(path, result.path) && Objects.equals(redirect, result.redirect);
        }

        @Override
        public int hashCode() {
            return Objects.hash(path, redirect);
        }

        @Override
        public String toString() {
            return "Result{" +
                    "path=" + path +
                    ", redirect=" + redirect +
                    '}';
        }
    }

    record Path(String path, String workspace){}
    record Redirect(String destination, int redirectStatusCode){}
}
