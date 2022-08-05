---
sidebar_label: Relator
---

# Relator class

The class is used to generate top-level \[included
data\](https://jsonapi.org/format/\#document-top-level) as well as resource-level
\[relationships\](https://jsonapi.org/format/\#document-resource-object-relationships).

Example:

```typescript
[[include:relator.example.ts]]
```

**Signature:**

```typescript
export default class Relator<PrimaryType, RelatedType extends Dictionary<any> = any>
```

## Constructors

| Constructor                                                                     | Modifiers | Description |
| ------------------------------------------------------------------------------- | --------- | ----------- |
| [(constructor)(fetch, serializer, options)](./ts-japi.relator._constructor_.md) |           | Creates a . |

## Properties

| Property                                              | Modifiers           | Type             | Description                                                        |
| ----------------------------------------------------- | ------------------- | ---------------- | ------------------------------------------------------------------ |
| [defaultOptions](./ts-japi.relator.defaultoptions.md) | <code>static</code> | { linkers: {}; } | Default options. Can be edited to change default options globally. |
| [relatedName](./ts-japi.relator.relatedname.md)       |                     | string           |                                                                    |
