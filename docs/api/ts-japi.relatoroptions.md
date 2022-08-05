---
sidebar_label: RelatorOptions
---

# RelatorOptions interface

**Signature:**

```typescript
export interface RelatorOptions<PrimaryType, RelatedType extends Dictionary<any> = any>
```

## Properties

| Property                                          | Modifiers | Type                                                                                                                                                                                                                                                                                             | Description                                                                                                                             |
| ------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| [linkers](./ts-japi.relatoroptions.linkers.md)    |           | { relationship?: Linker&lt;\[PrimaryType, [SingleOrArray](./ts-japi.singleorarray.md)&lt;RelatedType&gt; \| [nullish](./ts-japi.nullish.md)\]&gt;; related?: Linker&lt;\[PrimaryType, [SingleOrArray](./ts-japi.singleorarray.md)&lt;RelatedType&gt; \| [nullish](./ts-japi.nullish.md)\]&gt;; } | A dictionary of s to use for constructing links.                                                                                        |
| [metaizer?](./ts-japi.relatoroptions.metaizer.md) |           | Metaizer&lt;\[PrimaryType, [SingleOrArray](./ts-japi.singleorarray.md)&lt;RelatedType&gt; \| [nullish](./ts-japi.nullish.md)\]&gt;                                                                                                                                                               | <i>(Optional)</i> A that gets the \[meta\](https://jsonapi.org/format/\#document-resource-object-relationships) about the relationship. |
