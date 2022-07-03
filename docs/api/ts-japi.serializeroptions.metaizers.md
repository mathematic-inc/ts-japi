---
sidebar_label: SerializerOptions.metaizers
---
# SerializerOptions.metaizers property

A dictionary of s to use in different locations of the document.

**Signature:**

```typescript
interface SerializerOptions {metaizers: {
        jsonapi?: Metaizer<[]>;
        document?: Metaizer<[SingleOrArray<PrimaryType> | nullish]>;
        resource?: Metaizer<[PrimaryType]>;
    };}
```
