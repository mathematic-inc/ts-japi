---
sidebar_label: SerializerOptions.onlyRelationship
---

# SerializerOptions.onlyRelationship property

This is used to serialize the \[resource
linkages\](https://jsonapi.org/format/\#document-resource-object-linkage) only. The value must be
the name of a collection for a relator in the option.

Only a single primary datum (as opposed to an array) \*\*MUST\*\* be serialized.

This option will ignore the options , , and .

**Signature:**

```typescript
interface SerializerOptions {
  onlyRelationship: string;
}
```
