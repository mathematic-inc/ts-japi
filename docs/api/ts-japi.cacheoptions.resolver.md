---
sidebar_label: CacheOptions.resolver
---
# CacheOptions.resolver() method

The method to use in determining data equality

 `Object.is`

**Signature:**

```typescript
interface CacheOptions {resolver(storedData: SingleOrArray<DataType> | nullish, newData: SingleOrArray<DataType> | nullish): boolean;}
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  storedData | [SingleOrArray](./ts-japi.singleorarray.md)&lt;DataType&gt; \| [nullish](./ts-japi.nullish.md) |  |
|  newData | [SingleOrArray](./ts-japi.singleorarray.md)&lt;DataType&gt; \| [nullish](./ts-japi.nullish.md) |  |

**Returns:**

boolean

