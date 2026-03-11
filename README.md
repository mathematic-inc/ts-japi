# ts:japi

<br/>
<img src="https://raw.githubusercontent.com/mathematic-inc/ts-japi/main/src/docs/assets/images/logo.svg" alt="{ts:japi}" width="350"/>
<br/>

![node-current](https://img.shields.io/node/v/ts-japi)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> A highly-modular (typescript-friendly)-framework agnostic library for serializing data to the
> JSON:API specification

- [ts:japi](#tsjapi)
  - [Features](#features)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
    - [Examples](#examples)
  - [Serialization](#serialization)
    - [Links](#links)
      - [Pagination](#pagination)
    - [Relationships](#relationships)
    - [Metadata](#metadata)
    - [Serializing Errors](#serializing-errors)
    - [Caching](#caching)
  - [Deserialization](#deserialization)
  - [API Reference](#api-reference)
    - [Serializer](#serializer)
    - [Relator](#relator)
    - [Linker](#linker)
    - [Metaizer](#metaizer)
    - [Paginator](#paginator)
    - [ErrorSerializer](#errorserializer)
    - [Cache](#cache)
    - [PolymorphicSerializer](#polymorphicserializer)
    - [JapiError](#japierror)
  - [Remarks](#remarks)
  - [FAQ](#faq)
  - [For Developers](#for-developers)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- This is the **only** typescript-compatible library that fully types the JSON:API specification and
  performs _proper_ serialization.
- **Zero dependencies**.
- This is the **only** library with [resource recursion](#faq).
- The modular framework laid out here _highly promotes_ the specifications intentions:
  - Using links is no longer obfuscated.
  - Meta can truly be placed anywhere with possible dependencies laid out visibly.
- This library is designed to adhere to the specifications "never remove, only add" policy, so we
  will remain backwards-compatible.

## Installation

```bash
npm install ts-japi
```

## Getting Started

There are several classes used to serialize data (only `Serializer` is strictly required):

- `Serializer` — primary resource serialization
- `Relator` — relationships and included resources
- `Linker` — document and resource links
- `Metaizer` — metadata at any level
- `Paginator` — pagination links
- `ErrorSerializer` — error serialization
- `Cache` — response caching
- `PolymorphicSerializer` — polymorphic resource serialization

### Examples

See the [examples](https://github.com/mathematic-inc/ts-japi/tree/main/examples) and
[test](https://github.com/mathematic-inc/ts-japi/tree/main/test) directories for usage.
The [full example](https://github.com/mathematic-inc/ts-japi/blob/main/examples/full.example.ts)
shows nearly every `Serializer` option in use.

## Serialization

`Serializer` is the only class required for basic serialization.

```typescript
import { Serializer } from 'ts-japi';

const UserSerializer = new Serializer('users');

const user = { id: 'sample_user_id', createdAt: new Date() };

console.log(await UserSerializer.serialize(user));
// {
//   jsonapi: { version: '1.0' },
//   data: {
//     type: 'users',
//     id: 'sample_user_id',
//     attributes: { createdAt: '2020-05-20T15:44:37.650Z' }
//   }
// }
```

### Links

`Linker` generates normalized [document links](https://jsonapi.org/format/#document-links). Its
methods are not meant to be called directly — pass it to a serializer option.

```typescript
import { Linker } from 'ts-japi';

const UserArticleLinker = new Linker((user: User, articles: Article | Article[]) => {
  return Array.isArray(articles)
    ? `https://www.example.com/users/${user.id}/articles/`
    : `https://www.example.com/users/${user.id}/articles/${articles.id}`;
});
```

#### Pagination

`Paginator` generates [pagination links](https://jsonapi.org/format/#fetching-pagination).

```typescript
import { Paginator } from 'ts-japi';

const ArticlePaginator = new Paginator((articles: Article | Article[]) => {
  if (Array.isArray(articles)) {
    const nextPage = Number(articles[0].id) + 1;
    const prevPage = Number(articles[articles.length - 1].id) - 1;
    return {
      first: `https://www.example.com/articles/0`,
      last: `https://www.example.com/articles/10`,
      next: nextPage <= 10 ? `https://www.example.com/articles/${nextPage}` : null,
      prev: prevPage >= 0 ? `https://www.example.com/articles/${prevPage}` : null,
    };
  }
  return;
});
```

Use it via `SerializerOptions.linkers.paginator`.

### Relationships

`Relator` generates top-level [included data](https://jsonapi.org/format/#document-top-level) and
resource-level [relationships](https://jsonapi.org/format/#document-resource-object-relationships).

```typescript
import { Serializer, Relator } from 'ts-japi';

const ArticleSerializer = new Serializer<Article>('articles');
const UserArticleRelator = new Relator<User, Article>(
  async (user) => user.getArticles(),
  ArticleSerializer
);

const UserSerializer = new Serializer<User>('users', {
  relators: UserArticleRelator,
});
```

`Relator` also accepts optional `Linker`s via the `linkers` option to define relationship and
related resource links.

### Metadata

`Metaizer` generates metadata. It can be used in:

- `ErrorSerializerOptions.metaizers`
- `RelatorOptions.metaizer`
- `SerializerOptions.metaizers`
- `LinkerOptions.metaizer`

```typescript
import { Metaizer } from 'ts-japi';

const UserArticleMetaizer = new Metaizer((user: User, articles: Article | Article[]) => {
  return Array.isArray(articles)
    ? { user_created: user.createdAt, article_created: articles.map((a) => a.createdAt) }
    : { user_created: user.createdAt, article_created: articles.createdAt };
});
```

### Serializing Errors

`ErrorSerializer` serializes any object as an error. Alternatively (recommended), extend `JapiError`
to construct typed server errors.

```typescript
import { ErrorSerializer } from 'ts-japi';

const PrimitiveErrorSerializer = new ErrorSerializer();

console.log(PrimitiveErrorSerializer.serialize(new Error('badness')));
// {
//   errors: [ { code: 'Error', detail: 'badness' } ],
//   jsonapi: { version: '1.0' }
// }
```

### Caching

Set `cache: true` in `SerializerOptions` for a default `Cache`, or pass a `Cache` instance for
custom equality logic.

```typescript
import { Serializer, Cache } from 'ts-japi';

const MyCache = new Cache({ resolver: (a, b) => a?.id === b?.id });
const UserSerializer = new Serializer('users', { cache: MyCache });
```

## Deserialization

This library does not provide deserialization. Many clients already consume JSON:API endpoints (see
[implementations](https://jsonapi.org/implementations/)), and unmarshalling data is typically
coupled to framework-specific code (e.g. React state). Tighter integration is recommended over an
unnecessary abstraction.

## API Reference

### Serializer

```typescript
new Serializer<PrimaryType>(collectionName: string, options?: Partial<SerializerOptions<PrimaryType>>)
```

**Methods:**

| Method | Description |
|---|---|
| `serialize(data, options?)` | Serializes primary data. Returns a `Promise<DataDocument>`. |
| `getRelators()` | Returns the relators associated with this serializer. |
| `setRelators(relators)` | Sets relators (useful for breaking cyclic dependencies). |
| `getIdKeyFieldName()` | Returns the name of the id field. |

**`SerializerOptions<PrimaryType>`:**

| Option | Type | Default | Description |
|---|---|---|---|
| `idKey` | `keyof PrimaryType` | `"id"` | The field name for the resource ID. |
| `version` | `string \| null` | `"1.0"` | JSON:API version. Set to `null` to omit. |
| `relators` | `Relator \| Relator[] \| Record<string, Relator>` | — | Relators that generate relationships and included resources. |
| `linkers.document` | `Linker` | — | Linker for the top-level self link. |
| `linkers.resource` | `Linker` | — | Linker for the resource-level self link. |
| `linkers.paginator` | `Paginator` | — | Paginator for pagination links. |
| `metaizers.jsonapi` | `Metaizer` | — | Metadata for the JSON:API object. |
| `metaizers.document` | `Metaizer` | — | Metadata for the top-level document. |
| `metaizers.resource` | `Metaizer` | — | Metadata for each resource object. |
| `include` | `number \| string[]` | `0` | Which relationships to include. A number includes all relationships up to that depth. An array of paths includes only those paths (e.g. `['articles', 'articles.comments']`). Takes precedence over `depth`. |
| `depth` | `number` | `0` | Depth of relators to recurse for included resources. Deprecated — use `include` instead. |
| `projection` | `Partial<Record<keyof PrimaryType, 0 \| 1>> \| null \| undefined` | `null` | Attribute projection. All 0s to hide, all 1s to show. `null` shows all. `undefined` omits `attributes`. |
| `cache` | `boolean \| Cache` | `false` | Enables response caching. |
| `onlyIdentifier` | `boolean` | `false` | Serializes only resource identifier objects (no attributes). |
| `onlyRelationship` | `string` | `false` | Serializes only the relationship linkage for the named relator. |
| `nullData` | `boolean` | `false` | Forces `data` to be `null`. |
| `asIncluded` | `boolean` | `false` | Moves primary data to `included` and uses identifier objects for `data`. |

### Relator

```typescript
new Relator<PrimaryType, RelatedType>(
  fetch: (data: PrimaryType) => Promise<RelatedType | RelatedType[] | null | undefined>,
  serializer: Serializer<RelatedType> | (() => Serializer<RelatedType>),
  options?: Partial<RelatorOptions<PrimaryType, RelatedType>>
)
```

Passing a getter function `() => Serializer` instead of a `Serializer` instance breaks circular
references between serializers. When using a getter, `options.relatedName` is required.

**`RelatorOptions<PrimaryType, RelatedType>`:**

| Option | Type | Description |
|---|---|---|
| `linkers.relationship` | `Linker<[PrimaryType, RelatedType \| RelatedType[] \| null \| undefined]>` | Linker for the relationship self link. |
| `linkers.related` | `Linker<[PrimaryType, RelatedType \| RelatedType[] \| null \| undefined]>` | Linker for the related resource link. |
| `metaizer` | `Metaizer<[PrimaryType, RelatedType \| RelatedType[] \| null \| undefined]>` | Metaizer for relationship metadata. |
| `relatedName` | `string` | Override for the relationship name (defaults to the serializer's collection name). Required when passing a serializer getter. |

### Linker

```typescript
new Linker<Dependencies>(
  link: (...args: Dependencies) => string,
  options?: LinkerOptions<Dependencies>
)
// where Dependencies extends any[]
```

**`LinkerOptions<Dependencies>`:**

| Option | Type | Description |
|---|---|---|
| `metaizer` | `Metaizer<Dependencies>` | Adds meta to the link object. |

### Metaizer

```typescript
new Metaizer<Dependencies>(
  metaize: (...args: Dependencies) => Record<string, unknown> | Promise<Record<string, unknown>>
)
// where Dependencies extends any[]
```

### Paginator

```typescript
new Paginator<DataType>(
  paginate: (data: DataType | DataType[]) => {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  } | undefined
)
```

The callback returns an object with optional `first`, `last`, `prev`, `next` string URLs (or `null`
to explicitly omit a link).

### ErrorSerializer

```typescript
new ErrorSerializer<ErrorType>(options?: Partial<ErrorSerializerOptions<ErrorType>>)
```

**Methods:**

| Method | Description |
|---|---|
| `serialize(errors, options?)` | Serializes one or more errors synchronously. Returns an `ErrorDocument`. |

By default, `ErrorSerializer` maps fields from standard `Error` objects:

| Error field | JSON:API field |
|---|---|
| `name` | `code` |
| `message` | `detail` |
| `id` | `id` |
| `code` | `status` |
| `reason` | `title` |
| `location` | `source.pointer` |

**`ErrorSerializerOptions<ErrorType>`:**

| Option | Type | Description |
|---|---|---|
| `attributes.id` | `keyof ErrorType` | Field to use for error id. Default: `"id"` |
| `attributes.status` | `keyof ErrorType` | Field to use for HTTP status. Default: `"code"` |
| `attributes.code` | `keyof ErrorType` | Field to use for error code. Default: `"name"` |
| `attributes.title` | `keyof ErrorType` | Field to use for error title. Default: `"reason"` |
| `attributes.detail` | `keyof ErrorType` | Field to use for error detail. Default: `"message"` |
| `attributes.source.pointer` | `keyof ErrorType` | Field for JSON Pointer source. Default: `"location"` |
| `attributes.source.parameter` | `keyof ErrorType` | Field for query parameter source. Default: `undefined` |
| `attributes.source.header` | `keyof ErrorType` | Field for header source. Default: `undefined` |
| `linkers.about` | `Linker<[JapiError]>` | Linker for the error about link. |
| `metaizers.jsonapi` | `Metaizer<[]>` | Metadata for the JSON:API object. |
| `metaizers.document` | `Metaizer<[JapiError[]]>` | Metadata for the top-level document. |
| `metaizers.error` | `Metaizer<[JapiError]>` | Metadata for each error object. |
| `version` | `string \| null` | JSON:API version. Default: `"1.0"` |

### Cache

```typescript
new Cache<PrimaryType>(options?: Partial<CacheOptions<PrimaryType>>)
```

**`CacheOptions<PrimaryType>`:**

| Option | Type | Default | Description |
|---|---|---|---|
| `limit` | `number` | `10` | Maximum number of documents to store before evicting the oldest. |
| `resolver` | `(stored, incoming) => boolean` | `Object.is` | Equality function to determine cache hits. |

### PolymorphicSerializer

Serializes a mixed array of resources that share a common discriminant field. Each type is routed to
its own `Serializer`.

```typescript
new PolymorphicSerializer<PrimaryType>(
  commonName: string,
  key: keyof PrimaryType,
  serializers: Record<string, Serializer> | Record<string, () => Serializer>
)
```

**Example:**

```typescript
import { PolymorphicSerializer, Serializer } from 'ts-japi';

const DogSerializer = new Serializer('dogs');
const CatSerializer = new Serializer('cats');

const AnimalSerializer = new PolymorphicSerializer('animals', 'type', {
  dog: DogSerializer,
  cat: CatSerializer,
});

const animals = [
  { id: '1', type: 'dog', name: 'Rex' },
  { id: '2', type: 'cat', name: 'Whiskers' },
];

console.log(await AnimalSerializer.serialize(animals));
```

### JapiError

Extend `JapiError` to create typed errors that pass through `ErrorSerializer` unchanged.

```typescript
import { JapiError, ErrorSerializer } from 'ts-japi';

class NotFoundError extends JapiError {
  constructor(id: string) {
    super({ status: '404', code: 'NOT_FOUND', title: 'Not Found', detail: `Resource ${id} not found` });
  }
}

const serializer = new ErrorSerializer();
console.log(serializer.serialize(new NotFoundError('42')));
// { errors: [{ status: '404', code: 'NOT_FOUND', title: 'Not Found', detail: 'Resource 42 not found' }], jsonapi: { version: '1.0' } }
```

**`JapiError` fields:**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier for this error occurrence. |
| `status` | `string` | HTTP status code as a string. |
| `code` | `string` | Application-specific error code. |
| `title` | `string` | Short, human-readable summary (should not change between occurrences). |
| `detail` | `string` | Human-readable explanation of this specific occurrence. |
| `source.pointer` | `string` | JSON Pointer to the source field (e.g. `/data/attributes/name`). |
| `source.parameter` | `string` | Query parameter that caused the error. |
| `source.header` | `string` | Request header that caused the error. |
| `links` | `object` | Links object (e.g. `about` link). |
| `meta` | `object` | Non-standard meta information. |

## Remarks

There are several model classes used inside TS:JAPI such as `Resource` and `Relationships`. These
models are used for normalization as well as traversing a JSON:API document. If you plan to fork
this repo, you can extend these models and reimplement them to create your own custom (non-standard,
extended) serializer.

## FAQ

> Why not just allow optional functions that return the internal `Link` Class (or just a URI
> `string`)?

The `Link` class is defined to be as general as possible in case of changes in the specification. In
particular, the implementation of metadata and the types in our library rely on the generality of
the `Link` class. Relying on user arguments will generate a lot of overhead for both us and users
whenever the specs change.

> Why does the `Meta` class exist if it is essentially just a plain object?

In case the specification is updated to change the meta objects in some functional way.

> What is "resource recursion"?

Due to [compound documents](https://jsonapi.org/format/#document-compound-documents), it is possible
to recurse through related resources via their
[resource linkages](https://jsonapi.org/format/#document-resource-object-linkage) and obtain
[included resources](https://jsonapi.org/format/#document-top-level) beyond primary data relations.
Use the `include` or `depth` option on `Serializer` with caution — deep recursion can degrade
performance significantly.

## For Developers

To get started in developing this library, run `pnpm install`, `pnpm build` and `pnpm test` (in
this precise order) to assure everything is in working order.

## Contributing

This project is maintained by the author, however contributions are welcome and appreciated. You can
find TS:JAPI on GitHub:
[https://github.com/mathematic-inc/ts-japi](https://github.com/mathematic-inc/ts-japi)

Feel free to submit an issue, but please do not submit pull requests unless it is to fix some issue.
Feel free to open an issue if you find a bug.

## License

Copyright © 2020 [mathematic-inc](https://github.com/mathematic-inc).

Licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).

> This project is free and open-source work by a 501(c)(3) non-profit. If you find it useful, please consider [donating](https://github.com/sponsors/mathematic-inc).
