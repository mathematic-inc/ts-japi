---
sidebar_label: API
---

# API Reference

## Classes

| Class                                           | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| [Cache_2](./ts-japi.cache_2.md)                 |                                                              |
| [ErrorSerializer](./ts-japi.errorserializer.md) | <p>The class is used to serialize errors.</p><p>Example:</p> |

```typescript
[[include:error-serializer.example.ts]]
```

| | [JapiError](./ts-japi.japierror.md) | | | [Linker](./ts-japi.linker.md) | <p>The class is used
to construct a \[link\](https://jsonapi.org/format/\#document-links).</p><p>Example:</p>

```typescript
[[include:linker.example.ts]]
```

| | [Metaizer](./ts-japi.metaizer.md) | <p>The class is used to construct \[meta
information\](https://jsonapi.org/format/\#document-meta).</p><p>Example:</p>

```typescript
[[include:metaizer.example.ts]]
```

| | [Paginator](./ts-japi.paginator.md) | <p>The class is used to construct \[pagination
links\](https://jsonapi.org/format/\#fetching-pagination).</p><p>Example:</p>

```typescript
[[include:paginator.example.ts]]
```

| | [Relator](./ts-japi.relator.md) | <p>The class is used to generate top-level \[included
data\](https://jsonapi.org/format/\#document-top-level) as well as resource-level
\[relationships\](https://jsonapi.org/format/\#document-resource-object-relationships).</p><p>Example:</p>

```typescript
[[include:relator.example.ts]]
```

| | [Serializer](./ts-japi.serializer.md) | <p>The class is the main class used to serializer data
(you can use the class to serialize errors).</p><p>Example:</p>

```typescript
[[include:serializer.example.ts]]
```

|

## Functions

| Function                                                  | Description                                       |
| --------------------------------------------------------- | ------------------------------------------------- |
| [isErrorDocument(document)](./ts-japi.iserrordocument.md) | Detects an <code>ErrorDocument</code> like object |
| [isObject(o)](./ts-japi.isobject.md)                      |                                                   |
| [isPlainObject(o)](./ts-japi.isplainobject.md)            |                                                   |

## Interfaces

| Interface                                                     | Description |
| ------------------------------------------------------------- | ----------- |
| [BaseDocument](./ts-japi.basedocument.md)                     |             |
| [CacheOptions](./ts-japi.cacheoptions.md)                     |             |
| [DataDocument](./ts-japi.datadocument.md)                     |             |
| [ErrorAttributeOption](./ts-japi.errorattributeoption.md)     |             |
| [ErrorDocument](./ts-japi.errordocument.md)                   |             |
| [ErrorOptions](./ts-japi.erroroptions.md)                     |             |
| [ErrorSerializerOptions](./ts-japi.errorserializeroptions.md) |             |
| [ErrorSource](./ts-japi.errorsource.md)                       |             |
| [ErrorSourceAttribute](./ts-japi.errorsourceattribute.md)     |             |
| [JSONAPIObject](./ts-japi.jsonapiobject.md)                   |             |
| [LinkerOptions](./ts-japi.linkeroptions.md)                   |             |
| [MetaDocument](./ts-japi.metadocument.md)                     |             |
| [PaginationOf](./ts-japi.paginationof.md)                     |             |
| [RelatorOptions](./ts-japi.relatoroptions.md)                 |             |
| [SerializerOptions](./ts-japi.serializeroptions.md)           |             |

## Type Aliases

| Type Alias                                              | Description                                                          |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| [Dictionary](./ts-japi.dictionary.md)                   |                                                                      |
| [nullish](./ts-japi.nullish.md)                         |                                                                      |
| [PrimaryData](./ts-japi.primarydata.md)                 |                                                                      |
| [ResourceLinkage](./ts-japi.resourcelinkage.md)         |                                                                      |
| [SingleOrArray](./ts-japi.singleorarray.md)             | A utility type for describing a single object or an array of objects |
| [UnionToIntersection](./ts-japi.uniontointersection.md) |                                                                      |
| [VariadicFunction](./ts-japi.variadicfunction.md)       | A function that takes several arguments and outputs something.       |
