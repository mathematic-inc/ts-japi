---
sidebar_label: JapiError
---

# JapiError class

**Signature:**

```typescript
export default class JapiError
```

## Constructors

| Constructor                                                    | Modifiers | Description                                                   |
| -------------------------------------------------------------- | --------- | ------------------------------------------------------------- |
| [(constructor)(options)](./ts-japi.japierror._constructor_.md) |           | Constructs a new instance of the <code>JapiError</code> class |

## Properties

| Property                                 | Modifiers | Type                                                                                 | Description                                                                                                                                                                |
| ---------------------------------------- | --------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [code?](./ts-japi.japierror.code.md)     |           | string                                                                               | <i>(Optional)</i> An application-specific error code, expressed as a string value.                                                                                         |
| [detail?](./ts-japi.japierror.detail.md) |           | string                                                                               | <i>(Optional)</i> A human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.                                |
| [id?](./ts-japi.japierror.id.md)         |           | string                                                                               | <i>(Optional)</i> A unique identifier for this particular occurrence of the problem.                                                                                       |
| [links?](./ts-japi.japierror.links.md)   |           | [Dictionary](./ts-japi.dictionary.md)&lt;Link \| [nullish](./ts-japi.nullish.md)&gt; | <i>(Optional)</i> A links object                                                                                                                                           |
| [meta?](./ts-japi.japierror.meta.md)     |           | Meta                                                                                 | <i>(Optional)</i> A meta object containing non-standard meta information about the error.                                                                                  |
| [source?](./ts-japi.japierror.source.md) |           | { pointer?: string; parameter?: string; header?: string; }                                            | <i>(Optional)</i> An object containing references to the source of the error, optionally including any of the following members.                                           |
| [status?](./ts-japi.japierror.status.md) |           | string                                                                               | <i>(Optional)</i> The HTTP status code applicable to this problem, expressed as a string value.                                                                            |
| [title?](./ts-japi.japierror.title.md)   |           | string                                                                               | <i>(Optional)</i> A short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization. |

## Methods

| Method                                                           | Modifiers           | Description                                                            |
| ---------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------- |
| [isLikeJapiError(error)](./ts-japi.japierror.islikejapierror.md) | <code>static</code> | Tests whether <code>error</code> has similar attributes to a JapiError |
