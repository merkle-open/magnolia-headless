# Vanity endpoint
provides vanity model to frontend (consumed by middleware).

## setup
```java
import com.merkle.oss.magnolia.headless.api.vanity.VanityProvider;

public class SomeVanityProvider implements VanityProvider {
    @Override
    public Optional<Vanity> getVanity(Locale locale, Site site, String path) {
        return //TODO
    }
}
```

```xml
<component>
    <type>com.merkle.oss.magnolia.headless.api.vanity.VanityProvider</type>
    <implementation>...SomeVanityProvider</implementation>
</component>
```
