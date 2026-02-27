# Robots txt
provides robots txt to frontend (consumed by api endpoint).

Endpoints to all SitemapProviders are appended (see [Sitemap endpoint](../sitemap/README.md)).

## setup
```java
import com.merkle.oss.magnolia.headless.api.robots.RobotsTextProvider;

@Bean
public RobotsTextProvider robotsTextProvider() {
    return (request, site) -> Optional.empty(); //TODO implement
}
```
