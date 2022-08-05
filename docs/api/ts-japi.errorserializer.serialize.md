---
sidebar_label: ErrorSerializer.serialize
---

# ErrorSerializer.serialize() method

The actual serialization function.

**Signature:**

```typescript
class ErrorSerializer {
  serialize(
    errors: SingleOrArray<ErrorType>,
    options?: Partial<ErrorSerializerOptions<ErrorType>>
  ): ErrorDocument;
}
```

## Parameters

| Parameter | Type                                                                                          | Description                                  |
| --------- | --------------------------------------------------------------------------------------------- | -------------------------------------------- |
| errors    | [SingleOrArray](./ts-japi.singleorarray.md)&lt;ErrorType&gt;                                  | Errors to serialize.                         |
| options   | Partial&lt;[ErrorSerializerOptions](./ts-japi.errorserializeroptions.md)&lt;ErrorType&gt;&gt; | <i>(Optional)</i> Options to use at runtime. |

**Returns:**

[ErrorDocument](./ts-japi.errordocument.md)
