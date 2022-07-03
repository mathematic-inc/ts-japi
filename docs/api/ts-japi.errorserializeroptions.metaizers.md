---
sidebar_label: ErrorSerializerOptions.metaizers
---
# ErrorSerializerOptions.metaizers property

A dictionary of s to use in different locations of the document.

**Signature:**

```typescript
interface ErrorSerializerOptions {metaizers: {
        jsonapi?: Metaizer<[]>;
        document?: Metaizer<[JapiError[]]>;
        error?: Metaizer<[JapiError]>;
    };}
```
