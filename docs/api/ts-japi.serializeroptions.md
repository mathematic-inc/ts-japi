---
sidebar_label: SerializerOptions
---
# SerializerOptions interface

**Signature:**

```typescript
export interface SerializerOptions<PrimaryType extends Dictionary<any> = any> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [asIncluded](./ts-japi.serializeroptions.asincluded.md) |  | boolean | <p>Whether to make primary data as an \[included resource\](https://jsonapi.org/format/\#document-compound-documents) and use \[resource identifier objects\](https://jsonapi.org/format/\#document-resource-identifier-objects) for \[top-level data\](https://jsonapi.org/format/\#document-top-level).</p><p> <code>false</code></p> |
|  [cache](./ts-japi.serializeroptions.cache.md) |  | boolean \| Cache&lt;PrimaryType&gt; | <p>Enables caching of documents. If a  is given, then the given  will be used.</p><p> <code>false</code></p> |
|  [depth](./ts-japi.serializeroptions.depth.md) |  | number | <p>Determines the depth of <code>relator</code>s to use for \[included resources\](https://jsonapi.org/format/\#document-compound-documents).</p><p>\*\*PLEASE TAKE CAUTION\*\*: If this property is <code>Infinity</code>, performance can degrade \*\*significantly\*\*. It is \*RECOMMENDED\* to use more requests rather than a single one if such depth is required since included resources can be \*\*inhomogenous\*\* thus difficult to traverse.</p><p>Must be a number in <code>[0, Infinity]</code>.</p><p> <code>0</code></p> |
|  [idKey](./ts-japi.serializeroptions.idkey.md) |  | keyof PrimaryType | <p>The key name for the identifier in the resource.</p><p> <code>&quot;id&quot;</code></p> |
|  [linkers](./ts-japi.serializeroptions.linkers.md) |  | { document?: Linker&lt;\[[SingleOrArray](./ts-japi.singleorarray.md)&lt;PrimaryType&gt; \| [nullish](./ts-japi.nullish.md)\]&gt;; resource?: Linker&lt;\[PrimaryType\]&gt;; paginator?: Paginator&lt;PrimaryType&gt;; } | A set of options for constructing \[top-level links\](https://jsonapi.org/format/\#document-top-level). |
|  [metaizers](./ts-japi.serializeroptions.metaizers.md) |  | { jsonapi?: Metaizer&lt;\[\]&gt;; document?: Metaizer&lt;\[[SingleOrArray](./ts-japi.singleorarray.md)&lt;PrimaryType&gt; \| [nullish](./ts-japi.nullish.md)\]&gt;; resource?: Metaizer&lt;\[PrimaryType\]&gt;; } | A dictionary of s to use in different locations of the document. |
|  [nullData](./ts-japi.serializeroptions.nulldata.md) |  | boolean | <p>Whether to use <code>null</code> value the <code>data</code> field.</p><p>This option will ignore options , , and  (and all options they ignores).</p><p> <code>false</code></p> |
|  [onlyIdentifier](./ts-japi.serializeroptions.onlyidentifier.md) |  | boolean | <p>Whether to only serialize the identifier.</p><p>This option will ignore the options </p><p> <code>false</code></p> |
|  [onlyRelationship](./ts-japi.serializeroptions.onlyrelationship.md) |  | string | <p>This is used to serialize the \[resource linkages\](https://jsonapi.org/format/\#document-resource-object-linkage) only. The value must be the name of a collection for a relator in the  option.</p><p>Only a single primary datum (as opposed to an array) \*\*MUST\*\* be serialized.</p><p>This option will ignore the options , , and .</p> |
|  [projection](./ts-japi.serializeroptions.projection.md) |  | Partial&lt;Record&lt;keyof PrimaryType, 0 \| 1&gt;&gt; \| null \| undefined | <p>An object of 0 \*OR\* 1 (\*\*NOT BOTH\*\*) to denote hide or show attributes respectively.</p><p>If set (directly) to <code>undefined</code>, then the <code>attributes</code> field will be left <code>undefined</code>. If set to <code>null</code>, then every attribute will show. If set to <code>{}</code>, then every attribute will hide.</p><p> <code>null</code></p> |
|  [relators?](./ts-japi.serializeroptions.relators.md) |  | Relator&lt;PrimaryType&gt; \| Array&lt;Relator&lt;PrimaryType&gt;&gt; \| Record&lt;string, Relator&lt;PrimaryType&gt;&gt; | <p><i>(Optional)</i> A  that generates <code>relationships</code> for a given primary resource.</p><p>\*Note\*: You can add more relators by using . This is useful in case you have a cycle of relators among serializers.</p><p>See \[relationships objects\](https://jsonapi.org/format/\#document-resource-object-relationships) for more information.</p> |
|  [version](./ts-japi.serializeroptions.version.md) |  | string \| null | <p>The highest JSON API version supported. Set to <code>null</code> to omit version.</p><p> <code>1.0</code></p> |

