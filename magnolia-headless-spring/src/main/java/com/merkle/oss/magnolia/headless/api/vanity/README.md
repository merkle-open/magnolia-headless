# Vanity
provides vanity model to frontend (consumed by middleware).

## setup
```java
@Bean
public VanityProvider vanityProvider() {
    return (locale, site, path) -> Optional.empty(); //TODO implement
}
```
