# Dynamic response header
provides response headers to frontend (consumed by middleware).

Injected into a set.

## setup
```java
import java.util.stream.Stream;

@Bean
public DynamicResponseHeaderProvider someDynamicResponseHeaderProvider() {
    return (request, site) -> Stream.empty(); //TODO implement
}
```
