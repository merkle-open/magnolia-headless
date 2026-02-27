# Page controller
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

## page path mapper
Can be used to map the page path / response. Injected into a list using @Order. First one to return a redirect breaks the chain.

### provided mappers
- [PathParamsPagePathMapper](./mapper/pathparam/README.md)
