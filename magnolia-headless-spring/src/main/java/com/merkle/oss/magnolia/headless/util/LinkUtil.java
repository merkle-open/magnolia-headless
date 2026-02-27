package com.merkle.oss.magnolia.headless.util;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component("MagnoliaHeadlessSpring-LinkUtil")
public class LinkUtil {
    private static final Pattern ANCHOR_PATTERN = Pattern.compile("^([^#]*)(#.+|)$");

    public String removeAnchor(final String link) {
        final Matcher matcher = ANCHOR_PATTERN.matcher(link);
        if (matcher.matches()) {
            return matcher.group(1);
        }
        return link;
    }

    public Optional<String> getAnchor(final String link) {
        final Matcher matcher = ANCHOR_PATTERN.matcher(link);
        if (matcher.matches()) {
            return Optional.of(matcher.group(2));
        }
        return Optional.empty();
    }
}
