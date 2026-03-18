# Magnolia Headless

## Requirements
* Java 17
* Magnolia >= 6.4

```xml
<dependency>
    <groupId>com.merkle.oss.magnolia</groupId>
    <artifactId>magnolia-headless</artifactId>
    <version>0.0.4</version>
</dependency>
```

## setup
- implement and bind [LinkFactory](./src/main/java/com/merkle/oss/magnolia/headless/util/LinkFactory.java)

## controller
- [page controller](./src/main/java/com/merkle/oss/magnolia/headless/api/page/README.md)
- [template annotation controller](./src/main/java/com/merkle/oss/magnolia/headless/api/templateannotation/README.md)
- [vanity controller](./src/main/java/com/merkle/oss/magnolia/headless/api/vanity/README.md)
- [dynamic response header controller](./src/main/java/com/merkle/oss/magnolia/headless/api/dynamicresponseheader/README.md)
- [robots controller](./src/main/java/com/merkle/oss/magnolia/headless/api/robots/README.md)
- [sitemap controller](./src/main/java/com/merkle/oss/magnolia/headless/api/sitemap/README.md)
