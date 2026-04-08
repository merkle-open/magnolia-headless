# Dynamic response header
provides response headers to frontend (consumed by middleware).

Injected into a set.

## setup

```java
import info.magnolia.module.site.Site;

import com.merkle.oss.magnolia.headless.api.dynamicresponseheader.DynamicHeaderProvider;

import jakarta.servlet.http.HttpServletRequest;

public class SomeDynamicResponseHeaderProvider implements DynamicHeaderProvider {
    @Override
    public Stream<Header> stream(final HttpServletRequest request, final Site site) {
        return //TODO implement
    }
}
```

```java
import info.magnolia.objectfactory.guice.AbstractGuiceComponentConfigurer;

import com.merkle.oss.magnolia.headless.api.dynamicresponseheader.DynamicHeaderProvider;

public class HeadlessGuiceComponentConfigurer extends AbstractGuiceComponentConfigurer {

    @Override
    protected void configure() {
        super.configure();
        final Multibinder<DynamicHeaderProvider> binder = Multibinder.newSetBinder(binder(), DynamicHeaderProvider.class);
        binder.addBinding().to(SomeDynamicResponseHeaderProvider.class);
    }
}
```
