package com.merkle.oss.magnolia.headless.api.page.mapper.pathparam;

import java.net.URI;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Strings;
import org.apache.http.client.utils.URIBuilder;

import com.machinezoo.noexception.Exceptions;
import com.merkle.oss.magnolia.headless.util.LinkUtil;

import jakarta.annotation.Nullable;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.UriBuilder;

public class PathParamsLinkBuilder {
	private final String baseUrl;
	private final Map<String, SortedSet<String>> parameters;
	@Nullable
	private String anchor;

	public PathParamsLinkBuilder(final String baseUrl, final Comparator<String> keyComparator) {
		this.baseUrl = baseUrl;
		this.parameters = new TreeMap<>(keyComparator);
	}

	public PathParamsLinkBuilder params(final Map<String, Set<String>> params) {
		params.forEach(this::param);
		return this;
	}

	public PathParamsLinkBuilder param(final String key, final Collection<String> values) {
		parameters.put(key, new TreeSet<>(values));
		return this;
	}

	public PathParamsLinkBuilder anchor(@Nullable final String anchor) {
		this.anchor = anchor;
		return this;
	}

	public String getBaseUrl() {
		return baseUrl;
	}

	public Map<String, SortedSet<String>> getParameters() {
		return parameters;
	}

	@Nullable
	public String getAnchor() {
		return anchor;
	}

	public String build() {
		final List<String> pathParameters = Stream.concat(
				Arrays.stream(URI.create(baseUrl).getPath().split("/")).filter(StringUtils::isNotEmpty),
				parameters.entrySet().stream()
						.filter(paramEntry -> !paramEntry.getValue().isEmpty())
						.flatMap(paramEntry ->
								Stream.concat(
										Stream.of(paramEntry.getKey()),
										paramEntry.getValue().stream()
								)
						)
		).toList();
		final String link = Exceptions.wrap().get(() -> new URIBuilder(baseUrl)
				.setPathSegments(pathParameters)
				.build().toString());

		return Optional
				.ofNullable(anchor)
				.filter(StringUtils::isNotBlank)
				.map(a -> Strings.CS.prependIfMissing(a, "#"))
				.map(link::concat)
				.orElse(link);
	}

	public static class Parser {
		private final LinkUtil linkUtil;
		private final Comparator<String> keyComparator;
		private final Pattern baseUrlPattern;
		private final Map<String, Pattern> parameterPatterns;

		public Parser(
				final LinkUtil linkUtil,
				final List<String> parameterKeys
		) {
			this.linkUtil = linkUtil;
			this.keyComparator = Comparator.comparing(parameterKeys::indexOf);
			this.baseUrlPattern = Pattern.compile("^(.*?)/("+ String.join("|", parameterKeys) +")");
			this.parameterPatterns = parameterKeys.stream().collect(Collectors.toMap(Function.identity(), parameterKey ->
					Pattern.compile("/" + parameterKey + "/(.*?)((/"+ streamWithItemFirst(parameterKeys, parameterKey).collect(Collectors.joining("|")) + ")|$)")
			));
		}

		private Stream<String> streamWithItemFirst(final Collection<String> collection, final String orderFirst) {
			return collection.stream().sorted(Comparator.comparing(orderFirst::equals).reversed());
		}

		public PathParamsLinkBuilder parse(final String link) {
			return new PathParamsLinkBuilder(getBaseUrl(link), keyComparator)
					.params(getParameters(link))
					.anchor(linkUtil.getAnchor(link).orElse(null));
		}

		private String getBaseUrl(final String link) {
			return Optional
					.of(baseUrlPattern.matcher(link))
					.filter(Matcher::find)
					.map(matcher -> matcher.group(1))
					.filter(StringUtils::isNotEmpty)
					.orElseGet(() -> linkUtil.removeAnchor(link));
		}

		private Map<String, Set<String>> getParameters(final String link) {
			final String linkWithoutAnchor = linkUtil.removeAnchor(link);
			return parameterPatterns.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, entry -> getParamValues(entry.getValue(), linkWithoutAnchor)));
		}

		private Set<String> getParamValues(final Pattern pattern, final String link) {
			return Optional.of(pattern.matcher(link))
					.filter(Matcher::find)
					.map(matcher -> matcher.group(1))
					.stream()
					.flatMap(values ->
							Arrays.stream(values.split("/"))
					)
					.filter(Predicate.not(String::isBlank))
					.collect(Collectors.toSet());
		}

		public static class Factory {
			private final LinkUtil linkUtil;

			@Inject
			public Factory(final LinkUtil linkUtil) {
				this.linkUtil = linkUtil;
			}

			public Parser create(final List<String> parameterKeys) {
				return new Parser(linkUtil, parameterKeys);
			}
		}
	}
}
