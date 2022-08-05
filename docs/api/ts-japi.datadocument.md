---
sidebar_label: DataDocument
---

# DataDocument interface

**Signature:**

```typescript
export interface DataDocument<PrimaryType extends Dictionary<any>> extends Partial<MetaDocument>
```

**Extends:** Partial&lt;[MetaDocument](./ts-japi.metadocument.md)

## Properties

| Property                                        | Modifiers | Type                                                                                                                                          | Description       |
| ----------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| [data](./ts-japi.datadocument.data.md)          |           | [PrimaryData](./ts-japi.primarydata.md)&lt;PrimaryType&gt;                                                                                    |                   |
| [included?](./ts-japi.datadocument.included.md) |           | Resource\[\]                                                                                                                                  | <i>(Optional)</i> |
| [links?](./ts-japi.datadocument.links.md)       |           | [Dictionary](./ts-japi.dictionary.md)&lt;Link \| [nullish](./ts-japi.nullish.md)&gt; \| [PaginationOf](./ts-japi.paginationof.md)&lt;Link&gt; | <i>(Optional)</i> |
