---
sidebar_label: Serializer
---
# Serializer class

The  class is the main class used to serializer data (you can use the  class to serialize errors).

Example:

```typescript
[[include:serializer.example.ts]]
```

**Signature:**

```typescript
export default class Serializer<PrimaryType extends Dictionary<any> = any> 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(collectionName, options)](./ts-japi.serializer._constructor_.md) |  | Creates a . |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [cache](./ts-japi.serializer.cache.md) |  | Cache&lt;PrimaryType&gt; | Caching |
|  [collectionName](./ts-japi.serializer.collectionname.md) |  | string | The name to use for the type. |
|  [defaultOptions](./ts-japi.serializer.defaultoptions.md) | <code>static</code> | { idKey: string; version: string; onlyIdentifier: boolean; nullData: boolean; asIncluded: boolean; onlyRelationship: boolean; cache: boolean; depth: number; projection: null; linkers: {}; metaizers: {}; } | Default options. Can be edited to change default options globally. |
|  [helpers](./ts-japi.serializer.helpers.md) |  | Helpers&lt;PrimaryType&gt; | The set of helper functions for the serializer |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [getRelators()](./ts-japi.serializer.getrelators.md) |  | Gets the s associated with this serializer |
|  [serialize(data, options)](./ts-japi.serializer.serialize.md) |  | The actual serialization function. |
|  [setRelators(relators)](./ts-japi.serializer.setrelators.md) |  | Sets the s associated with this serializer |

