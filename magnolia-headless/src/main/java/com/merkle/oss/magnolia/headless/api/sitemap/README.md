# Sitemap
provides sitemaps to frontend (consumed by api endpoint).

Injected into a set, type has to be unique! The SitemapProviders are also used in the robots endpoint to generate the links to the sitemaps. 

## setup

```java
import info.magnolia.module.site.Site;
import java.util.Collections;
import java.util.Locale;
import java.util.Set;
import com.merkle.oss.magnolia.headless.api.sitemap.SitemapProvider;

import jakarta.servlet.http.HttpServletRequest;

public class SomeSitemapProvider implements SitemapProvider {
    @Override
    public String getType() {
        return "default";
    }

    @Override
    public Set<Url> get(final HttpServletRequest request, final Locale locale, final Site site) {
        return Collections.emptySet(); //TODO implement
    }
}
```

```java
import info.magnolia.objectfactory.guice.AbstractGuiceComponentConfigurer;
import com.merkle.oss.magnolia.headless.api.sitemap.SitemapProvider;

public class HeadlessGuiceComponentConfigurer extends AbstractGuiceComponentConfigurer {

    @Override
    protected void configure() {
        super.configure();
        final Multibinder<SitemapProvider> binder = Multibinder.newSetBinder(binder(), SitemapProvider.class);
        binder.addBinding().to(SomeSitemapProvider.class);
    }
}
```
