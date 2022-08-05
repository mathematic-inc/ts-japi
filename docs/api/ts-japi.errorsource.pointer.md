---
sidebar_label: ErrorSource.pointer
---

# ErrorSource.pointer property

A JSON Pointer \[RFC6901\] to the associated entity in the request document \[e.g. `/data` for a
primary data object, or `/data/attributes/title` for a specific attribute\].

**Signature:**

```typescript
interface ErrorSource {
  pointer?: string;
}
```
