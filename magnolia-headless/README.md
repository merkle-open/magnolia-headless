# Magnolia Headless

## Requirements
* Java 17
* Magnolia >= 6.4

```xml
<dependency>
    <groupId>com.merkle.oss.magnolia</groupId>
    <artifactId>magnolia-headless</artifactId>
    <version>0.0.8</version>
</dependency>
```

## setup
- implement and bind [LinkFactory](./src/main/java/com/merkle/oss/magnolia/headless/util/LinkFactory.java)

## endpoints
- [page endpoint](./src/main/java/com/merkle/oss/magnolia/headless/api/page/README.md)
- [template annotation endpoint](./src/main/java/com/merkle/oss/magnolia/headless/api/templateannotation/README.md)
- [vanity endpoint](./src/main/java/com/merkle/oss/magnolia/headless/api/vanity/README.md)
- [dynamic header endpoint](./src/main/java/com/merkle/oss/magnolia/headless/api/dynamicheader/README.md)
- [robots endpoint](./src/main/java/com/merkle/oss/magnolia/headless/api/robots/README.md)
- [sitemap endpoint](./src/main/java/com/merkle/oss/magnolia/headless/api/sitemap/README.md)
