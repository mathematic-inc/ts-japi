---
sidebar_label: ErrorSerializer
---
# ErrorSerializer class

The  class is used to serialize errors.

Example:

```typescript
[[include:error-serializer.example.ts]]
```

**Signature:**

```typescript
export default class ErrorSerializer<ErrorType> 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(options)](./ts-japi.errorserializer._constructor_.md) |  | Creates a . |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [defaultOptions](./ts-japi.errorserializer.defaultoptions.md) | <code>static</code> | { version: string; attributes: { id: string; status: string; code: string; title: string; detail: string; source: { pointer: string; parameter: undefined; }; }; metaizers: {}; linkers: {}; } | Default options. Can be edited to change default options globally. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [serialize(errors, options)](./ts-japi.errorserializer.serialize.md) |  | The actual serialization function. |

