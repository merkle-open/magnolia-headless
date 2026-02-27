package com.merkle.oss.magnolia.headless.api.robots;

import info.magnolia.module.site.Site;

import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;

public interface RobotsTextProvider {
    Optional<String> get(HttpServletRequest request, Site site);
}
