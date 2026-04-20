# Page endpoint
provides page content to frontend using rendering engine.

## setup
Implement and bind the following interfaces:

### ErrorPageProvider

```java
import com.merkle.oss.magnolia.headless.api.page.ErrorPageProvider;

public class SampleErrorPageProvider implements ErrorPageProvider {
    @Override
    public Optional<PowerNode> get(final Locale locale, final Site site, final int errorCode) {
        //TODO implement
    }
}
```
```xml
<component>
    <type>com.merkle.oss.magnolia.headless.api.page.ErrorPageProvider</type>
    <implementation>...SampleErrorPageProvider</implementation>
</component>
```


## page path mapper
Can be used to map the page path / response. Injected into a set and order using getOrder(). First one to return a redirect breaks the chain.

```java
import info.magnolia.objectfactory.guice.AbstractGuiceComponentConfigurer;

import java.util.List;

import com.google.inject.multibindings.Multibinder;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapper;

public class SomeGuiceComponentConfigurer extends AbstractGuiceComponentConfigurer {
    @Override
    protected void configure() {
        super.configure();

        final Multibinder<PagePathMapper> pagePathMapperMultibinder = Multibinder.newSetBinder(binder(), PagePathMapper.class);
        pagePathMapperMultibinder.addBinding().to(SomePagePathMapper.class);
    }
}
```

### provided mappers
- [PathParamsPagePathMapper](./mapper/pathparam/README.md)
