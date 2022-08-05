---
sidebar_label: Serializer.serialize
---

# Serializer.serialize() method

The actual serialization function.

**Signature:**

```typescript
class Serializer {
  serialize(
    data: SingleOrArray<PrimaryType> | nullish,
    options?: Partial<SerializerOptions<PrimaryType>>
  ): Promise<Partial<DataDocument<PrimaryType>>>;
}
```

## Parameters

| Parameter | Type                                                                                              | Description                                  |
| --------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| data      | [SingleOrArray](./ts-japi.singleorarray.md)&lt;PrimaryType&gt; \| [nullish](./ts-japi.nullish.md) | Data to serialize.                           |
| options   | Partial&lt;[SerializerOptions](./ts-japi.serializeroptions.md)&lt;PrimaryType&gt;&gt;             | <i>(Optional)</i> Options to use at runtime. |

**Returns:**

Promise&lt;Partial&lt;[DataDocument](./ts-japi.datadocument.md)&lt;PrimaryType&gt;&gt;&gt;
