---
sidebar_label: Relator.(constructor)
---

# Relator.(constructor)

Creates a .

**Signature:**

```typescript
class Relator {
  constructor(
    fetch: (data: PrimaryType) => Promise<RelatedType | RelatedType[] | nullish>,
    serializer: Serializer<RelatedType>,
    options?: Partial<RelatorOptions<PrimaryType, RelatedType>>
  );
}
```

## Parameters

| Parameter  | Type                                                                                                       | Description                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| fetch      | (data: PrimaryType) =&gt; Promise&lt;RelatedType \| RelatedType\[\] \| [nullish](./ts-japi.nullish.md)&gt; | Fetches related data from primary data.              |
| serializer | Serializer&lt;RelatedType&gt;                                                                              | The <code>Serializer</code> to use for related data. |
| options    | Partial&lt;[RelatorOptions](./ts-japi.relatoroptions.md)&lt;PrimaryType, RelatedType&gt;&gt;               | <i>(Optional)</i> Options for the relator.           |
