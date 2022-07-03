---
sidebar_label: ErrorAttributeOption
---
# ErrorAttributeOption interface

**Signature:**

```typescript
export interface ErrorAttributeOption<T> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [code](./ts-japi.errorattributeoption.code.md) |  | keyof T | <p>An application-specific error code.</p><p> <code>&quot;name&quot;</code></p> |
|  [detail](./ts-japi.errorattributeoption.detail.md) |  | keyof T | <p>A human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.</p><p> <code>&quot;message&quot;</code></p> |
|  [id](./ts-japi.errorattributeoption.id.md) |  | keyof T | <p>A unique identifier for this particular occurrence of the problem.</p><p> <code>&quot;id&quot;</code></p> |
|  [source](./ts-japi.errorattributeoption.source.md) |  | Partial&lt;[ErrorSourceAttribute](./ts-japi.errorsourceattribute.md)&lt;T&gt;&gt; | An object containing references to the source of the error, optionally including any of the following members. |
|  [status](./ts-japi.errorattributeoption.status.md) |  | keyof T | <p>The HTTP status code applicable to this problem.</p><p> <code>&quot;code&quot;</code></p> |
|  [title](./ts-japi.errorattributeoption.title.md) |  | keyof T | <p>A short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.</p><p> <code>&quot;reason&quot;</code></p> |

