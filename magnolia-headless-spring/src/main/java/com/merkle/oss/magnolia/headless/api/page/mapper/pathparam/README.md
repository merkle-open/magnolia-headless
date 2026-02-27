# PathParamPagePathMapper
Can be used to implement dynamic pages/path that doesn't exist in the jcr. e.g.: <br>
```
/<handlePrefix>/page1/tags/tag1
```
will resolve to `/<handlePrefix>/page1/tags` and add `tag1` to the request as attribute:

```java
import java.util.Collections;
import java.util.Optional;

import com.merkle.oss.magnolia.headless.api.page.mapper.pathparam.PathParamsPagePathMapper;

import jakarta.servlet.http.HttpServletRequest;

public Set<String> getTags(final HttpServletRequest request) {
    return Optional
            .ofNullable((Set<String>) request.getAttribute(PathParamsPagePathMapper.REQUEST_ATTRIBUTE_PREFIX + "tags"))
            .orElseGet(Collections::emptySet);
}

```

## setup
```java
@Bean
@Order(1)
public PathParamsPagePathMapper pathParamsPagePathMapper(final PathParamsPagePathMapper.Factory factory) {
    return factory.create(List.of("tags"));
}
```
