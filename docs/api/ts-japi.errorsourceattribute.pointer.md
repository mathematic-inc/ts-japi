---
sidebar_label: ErrorSourceAttribute.pointer
---

# ErrorSourceAttribute.pointer property

A JSON Pointer \[RFC6901\] to the associated entity in the request document \[e.g. `/data` for a
primary data object, or `/data/attributes/title` for a specific attribute\].

`"location"`

**Signature:**

```typescript
interface ErrorSourceAttribute {
  pointer: keyof T;
}
```
