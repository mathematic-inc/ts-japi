---
sidebar_label: ErrorOptions
---

# ErrorOptions interface

**Signature:**

```typescript
export interface ErrorOptions
```

## Properties

| Property                                    | Modifiers | Type                                    | Description                                                                                                                                                                |
| ------------------------------------------- | --------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [code?](./ts-japi.erroroptions.code.md)     |           | string                                  | <i>(Optional)</i> An application-specific error code.                                                                                                                      |
| [detail?](./ts-japi.erroroptions.detail.md) |           | string                                  | <i>(Optional)</i> A human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.                                |
| [id?](./ts-japi.erroroptions.id.md)         |           | string                                  | <i>(Optional)</i> A unique identifier for this particular occurrence of the problem.                                                                                       |
| [source?](./ts-japi.erroroptions.source.md) |           | [ErrorSource](./ts-japi.errorsource.md) | <i>(Optional)</i> An object containing references to the source of the error, optionally including any of the following members.                                           |
| [status?](./ts-japi.erroroptions.status.md) |           | number \| string                        | <i>(Optional)</i> The HTTP status code applicable to this problem.                                                                                                         |
| [title?](./ts-japi.erroroptions.title.md)   |           | string                                  | <i>(Optional)</i> A short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization. |
