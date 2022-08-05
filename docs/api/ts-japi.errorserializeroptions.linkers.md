---
sidebar_label: ErrorSerializerOptions.linkers
---

# ErrorSerializerOptions.linkers property

A set of options for constructing \[top-level
links\](https://jsonapi.org/format/\#document-top-level).

**Signature:**

```typescript
interface ErrorSerializerOptions {
  linkers: {
    about?: Linker<[JapiError]>;
  };
}
```
