---
sidebar_label: SerializerOptions.linkers
---

# SerializerOptions.linkers property

A set of options for constructing \[top-level
links\](https://jsonapi.org/format/\#document-top-level).

**Signature:**

```typescript
interface SerializerOptions {
  linkers: {
    document?: Linker<[SingleOrArray<PrimaryType> | nullish]>;
    resource?: Linker<[PrimaryType]>;
    paginator?: Paginator<PrimaryType>;
  };
}
```
