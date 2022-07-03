---
sidebar_label: CacheOptions
---
# CacheOptions interface

**Signature:**

```typescript
export interface CacheOptions<DataType> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [limit](./ts-japi.cacheoptions.limit.md) |  | number | <p>The maximum amount of documents that can be stored before erasure.</p><p> <code>10</code></p> |

## Methods

|  Method | Description |
|  --- | --- |
|  [resolver(storedData, newData)](./ts-japi.cacheoptions.resolver.md) | <p>The method to use in determining data equality</p><p> <code>Object.is</code></p> |

