---
sidebar_label: ErrorSourceAttribute
---
# ErrorSourceAttribute interface

**Signature:**

```typescript
export interface ErrorSourceAttribute<T> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [parameter](./ts-japi.errorsourceattribute.parameter.md) |  | keyof T | <p>A string indicating which URI query parameter caused the error.</p><p> <code>undefined</code></p> |
|  [pointer](./ts-japi.errorsourceattribute.pointer.md) |  | keyof T | <p>A JSON Pointer \[RFC6901\] to the associated entity in the request document \[e.g. <code>/data</code> for a primary data object, or <code>/data/attributes/title</code> for a specific attribute\].</p><p> <code>&quot;location&quot;</code></p> |

