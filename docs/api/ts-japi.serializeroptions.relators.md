---
sidebar_label: SerializerOptions.relators
---

# SerializerOptions.relators property

A that generates `relationships` for a given primary resource.

\*Note\*: You can add more relators by using . This is useful in case you have a cycle of relators
among serializers.

See \[relationships objects\](https://jsonapi.org/format/\#document-resource-object-relationships)
for more information.

**Signature:**

```typescript
interface SerializerOptions {
  relators?:
    | Relator<PrimaryType>
    | Array<Relator<PrimaryType>>
    | Record<string, Relator<PrimaryType>>;
}
```
