---
sidebar_label: ErrorSource
---

# ErrorSource interface

**Signature:**

```typescript
export interface ErrorSource
```

## Properties

| Property                                         | Modifiers | Type   | Description                                                                                                                                                                                                           |
| ------------------------------------------------ | --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [parameter?](./ts-japi.errorsource.parameter.md) |           | string | <i>(Optional)</i> A string indicating which URI query parameter caused the error.                                                                                                                                     |
| [pointer?](./ts-japi.errorsource.pointer.md)     |           | string | <i>(Optional)</i> A JSON Pointer \[RFC6901\] to the associated entity in the request document \[e.g. <code>/data</code> for a primary data object, or <code>/data/attributes/title</code> for a specific attribute\]. |
