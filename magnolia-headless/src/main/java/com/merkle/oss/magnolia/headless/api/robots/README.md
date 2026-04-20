# Robots txt endpoint
provides robots txt to frontend (consumed by api endpoint).

Endpoints to all SitemapProviders are appended (see [Sitemap endpoint](../sitemap/README.md)).

## setup
```java
import com.merkle.oss.magnolia.headless.api.robots.RobotsTextProvider;

public class SomeRobotsTextProvider implements RobotsTextProvider {
    @Override
    public Optional<String> get(HttpServletRequest request, Site site) {
        return //TODO
    }
}
```

```xml
<component>
    <type>com.merkle.oss.magnolia.headless.api.robots.RobotsTextProvider</type>
    <implementation>...SomeRobotsTextProvider</implementation>
</component>
```
