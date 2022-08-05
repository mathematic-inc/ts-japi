---
sidebar_label: Paginator.(constructor)
---

# Paginator.(constructor)

Creates a .

**Signature:**

```typescript
class Paginator {
  constructor(paginate: (data: SingleOrArray<DataType>) => PaginationOf<string> | void);
}
```

## Parameters

| Parameter | Type                                                                                                                                      | Description                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| paginate  | (data: [SingleOrArray](./ts-japi.singleorarray.md)&lt;DataType&gt;) =&gt; [PaginationOf](./ts-japi.paginationof.md)&lt;string&gt; \| void | A function to generate pagination links from data. |
