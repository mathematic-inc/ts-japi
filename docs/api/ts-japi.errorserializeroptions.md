---
sidebar_label: ErrorSerializerOptions
---

# ErrorSerializerOptions interface

**Signature:**

```typescript
export interface ErrorSerializerOptions<T extends Dictionary<any>>
```

## Properties

| Property                                                     | Modifiers | Type                                                                                                                     | Description                                                                                             |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| [attributes](./ts-japi.errorserializeroptions.attributes.md) |           | Partial&lt;[ErrorAttributeOption](./ts-japi.errorattributeoption.md)&lt;T&gt;&gt;                                        | An object of attribute names to use in place of the .                                                   |
| [linkers](./ts-japi.errorserializeroptions.linkers.md)       |           | { about?: Linker&lt;\[JapiError\]&gt;; }                                                                                 | A set of options for constructing \[top-level links\](https://jsonapi.org/format/\#document-top-level). |
| [metaizers](./ts-japi.errorserializeroptions.metaizers.md)   |           | { jsonapi?: Metaizer&lt;\[\]&gt;; document?: Metaizer&lt;\[JapiError\[\]\]&gt;; error?: Metaizer&lt;\[JapiError\]&gt;; } | A dictionary of s to use in different locations of the document.                                        |
| [version](./ts-japi.errorserializeroptions.version.md)       |           | string \| null                                                                                                           | <p>The highest JSON API version supported.</p><p> <code>1.0</code></p>                                  |
