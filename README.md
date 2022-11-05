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
  - [Documentation](#documentation)
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
  - [Remarks](#remarks)
  - [FAQ](#faq)
  - [For Developers](#for-developers)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- This is the **only** typescript-compatible library that fully types the JSON:API specification and
  performs _proper_ serialization.
- [**Zero dependencies**](#zdg).
- This is the **only** library with [resource recursion](#wirr).
- The modular framework laid out here _highly promotes_ the specifications intentions:
  - Using links is no longer obfuscated.
  - Meta can truly be placed anywhere with possible dependencies laid out visibly.
- This library is designed to adhere to the specifications "never remove, only add" policy, so we
  will remain backwards-compatible.

## Documentation

The [documentation](https://mathematic-inc.github.io/ts-japi/) has everything that is covered here
and more.

## Installation

You can install ts-japi in your project's directory as usual:

```bash
npm install ts-japi
```

## Getting Started

There are fives classes that are used to serialize data (only one of which is necessarily required).

- [`Serializer`](https://mathematic-inc.github.io/ts-japi/classes/serializer.html) with
  [`SerializerOptions`](https://mathematic-inc.github.io/ts-japi/interfaces/serializeroptions.html)
- [`Relator`](https://mathematic-inc.github.io/ts-japi/classes/relator.html) with
  [`RelatorOptions`](https://mathematic-inc.github.io/ts-japi/interfaces/relatoroptions.html)
- [`Linker`](https://mathematic-inc.github.io/ts-japi/classes/linker.html) with
  [`LinkerOptions`](https://mathematic-inc.github.io/ts-japi/interfaces/linkeroptions.html)
- [`Metaizer`](https://mathematic-inc.github.io/ts-japi/classes/metaizer.html)
- [`Paginator`](https://mathematic-inc.github.io/ts-japi/classes/paginator.html)
- [`ErrorSerializer`](https://mathematic-inc.github.io/ts-japi/classes/errorserializer.html) with
  [`ErrorSerializerOptions`](https://mathematic-inc.github.io/ts-japi/interfaces/errorserializeroptions.html)
- [`Cache`](https://mathematic-inc.github.io/ts-japi/classes/cache.html) with
  [`CacheOptions`](https://mathematic-inc.github.io/ts-japi/interfaces/cacheoptions.html)

You can check the [documentation](https://mathematic-inc.github.io/ts-japi) for a deeper insight
into the usage.

### Examples

You can check the [examples](https://github.com/mathematic-inc/ts-japi/tree/master/examples) and the
[test](https://github.com/mathematic-inc/ts-japi/tree/master/test) folders to see some examples
(such as the ones below). You can check
[this example](https://github.com/mathematic-inc/ts-japi/blob/master/examples/full.example.ts) to
see almost every option of
[`Serializer`](https://mathematic-inc.github.io/ts-japi/classes/serializer.html) exhausted.

## Serialization

The [`Serializer`](https://mathematic-inc.github.io/ts-japi/classes/serializer.html) class is the
only class required for basic serialization.

The following example constructs the most basic
[`Serializer`](https://mathematic-inc.github.io/ts-japi/classes/serializer.html): (Note the `await`)

```typescript
import { Serializer } from '../src';
import { User } from '../test/models';
import { getJSON } from '../test/utils/get-json';

const UserSerializer = new Serializer('users');

(async () => {
  const user = new User('sample_user_id');

  console.log('Output:', getJSON(await UserSerializer.serialize(user)));

  // Output: {
  //  jsonapi: { version: '1.0' },
  //  data: {
  //   type: 'users',
  //   id: 'sample_user_id',
  //   attributes: {
  //     createdAt: '2020-05-20T15:44:37.650Z',
  //     articles: [],
  //     comments: []
  //   }
  //  }
  // }
})();
```

### Links

The [`Linker`](https://mathematic-inc.github.io/ts-japi/classes/linker.html) class is used to
generate a normalized [document link](https://jsonapi.org/format/#document-links). Its methods are
not meant to be called. See the [FAQ](#faq) for reasons.

The following example constructs a
[`Linker`](https://mathematic-inc.github.io/ts-japi/classes/linker.html) for `User`s and `Article`s:

```typescript
import { Linker } from '../src';
import { User, Article } from '../test/models';
import { getJSON } from '../test/utils/get-json';

// The last argument should almost always be an array or a single object type.
// The reason for this is the potential for linking several articles.
const UserArticleLinker = new Linker((user: User, articles: Article | Article[]) => {
  return Array.isArray(articles)
    ? `https://www.example.com/users/${user.id}/articles/`
    : `https://www.example.com/users/${user.id}/articles/${articles.id}`;
});

// ! The rest of this example is just to illustrate internal behavior.
(async () => {
  const user = new User('sample_user_id');
  const article = new Article('same_article_id', user);

  console.log('Output:', getJSON(UserArticleLinker.link(user, article)));

  // Output: https://www.example.com/users/sample_user_id/articles/same_article_id
})();
```

#### Pagination

The [`Paginator`](https://mathematic-inc.github.io/ts-japi/classes/paginator.html) class is used to
generate [pagination links](https://jsonapi.org/format/#fetching-pagination). Its methods are not
meant to be called.

The following example constructs a
[`Paginator`](https://mathematic-inc.github.io/ts-japi/classes/paginator.html):

```typescript
import { Paginator } from '../src';
import { User, Article } from '../test/models';
import { getJSON } from '../test/utils/get-json';

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

// ! The rest of this example is just to illustrate internal behavior.
(async () => {
  const user = new User('sample_user_id');
  const article = new Article('same_article_id', user);

  console.log('Output:', getJSON(ArticlePaginator.paginate([article])));

  // Output: {
  //  first: 'https://www.example.com/articles/0',
  //  last: 'https://www.example.com/articles/10',
  //  prev: null,
  //  next: null
  // }
})();
```

### Relationships

The [`Relator`](https://mathematic-inc.github.io/ts-japi/classes/relator.html) class is used to
generate top-level [included data](https://jsonapi.org/format/#document-top-level) as well as
resource-level [relationships](https://jsonapi.org/format/#document-resource-object-relationships).
Its methods are not meant to be called.

[`Relator`](https://mathematic-inc.github.io/ts-japi/classes/relator.html)s may also take optional
[`Linker`](https://mathematic-inc.github.io/ts-japi/classes/linker.html)s (using the
[`linker`](https://mathematic-inc.github.io/ts-japi/interfaces/relatoroptions.html#linkers) option)
to define [relationship links](https://jsonapi.org/format/#document-resource-object-relationships)
and
[related resource links](https://jsonapi.org/format/#document-resource-object-related-resource-links).

The following example constructs a
[`Relator`](https://mathematic-inc.github.io/ts-japi/classes/relator.html) for `User`s and
`Article`s:

```typescript
import { Serializer, Relator } from '../src';
import { User, Article } from '../test/models';
import { getJSON } from '../test/utils/get-json';

const ArticleSerializer = new Serializer<Article>('articles');
const UserArticleRelator = new Relator<User, Article>(
  async (user) => user.getArticles(),
  ArticleSerializer
);

// ! The rest of this example is just to illustrate some internal behavior.
(async () => {
  const user = new User('sample_user_id');
  const article = new Article('same_article_id', user);
  User.save(user);
  Article.save(article);

  console.log('Output:', getJSON(await UserArticleRelator.getRelationship(user)));

  // Output: { data: [ { type: 'articles', id: 'same_article_id' } ] }
})();
```

### Metadata

The [`Metaizer`](https://mathematic-inc.github.io/ts-japi/classes/metaizer.html) class is used to
construct generate metadata given some dependencies. There are several locations
[`Metaizer`](https://mathematic-inc.github.io/ts-japi/classes/metaizer.html) can be used:

- [`ErrorSerializerOptions.metaizers`](https://mathematic-inc.github.io/ts-japi/interfaces/errorserializeroptions.html#metaizers)
- [`RelatorOptions.metaizer`](https://mathematic-inc.github.io/ts-japi/interfaces/relatoroptions.html#metaizer)
- [`SerializerOptions.metaizers`](https://mathematic-inc.github.io/ts-japi/interfaces/serializeroptions.html#metaizers)
- [`LinkerOptions.metaizer`](https://mathematic-inc.github.io/ts-japi/interfaces/linkeroptions.html#metaizer)

Like [`Linker`](https://mathematic-inc.github.io/ts-japi/classes/linker.html), its methods are not
meant to be called.

The following example constructs a
[`Metaizer`](https://mathematic-inc.github.io/ts-japi/classes/metaizer.html):

```typescript
import { User, Article } from '../test/models';
import { Metaizer } from '../src';
import { getJSON } from '../test/utils/get-json';

// The last argument should almost always be an array or a single object type.
// The reason for this is the potential for metaizing several articles.
const UserArticleMetaizer = new Metaizer((user: User, articles: Article | Article[]) => {
  return Array.isArray(articles)
    ? { user_created: user.createdAt, article_created: articles.map((a) => a.createdAt) }
    : { user_created: user.createdAt, article_created: articles.createdAt };
});

// ! The rest of this example is just to illustrate internal behavior.
(async () => {
  const user = new User('sample_user_id');
  const article = new Article('same_article_id', user);

  console.log('Output:', getJSON(UserArticleMetaizer.metaize(user, article)));

  // Output: {
  //  user_created: '2020-05-20T15:39:43.277Z',
  //  article_created: '2020-05-20T15:39:43.277Z'
  // }
})();
```

### Serializing Errors

The [`ErrorSerializer`](https://mathematic-inc.github.io/ts-japi/classes/errorserializer.html) class
is used to serialize any object considered an error (the
[`attributes`](https://mathematic-inc.github.io/ts-japi/interfaces/errorserializeroptions.html#attributes)
option allows you to choose what attributes to use during serialization). _Alternatively_
(**recommended**), you can construct custom errors by extending the
[`JapiError`](https://mathematic-inc.github.io/ts-japi/classes/japierror.html) class and use those
for all server-to-client errors.

The
[error serializer test](https://github.com/mathematic-inc/ts-japi/tree/master/test/error-serializer.test.ts)
includes an example of the alternative solution.

The following example constructs the most basic
[`ErrorSerializer`](https://mathematic-inc.github.io/ts-japi/classes/errorserializer.html): (Note
the lack of `await`)

```typescript
import { ErrorSerializer } from '../src';
import { getJSON } from '../test/utils/get-json';

const PrimitiveErrorSerializer = new ErrorSerializer();

(async () => {
  const error = new Error('badness');

  console.log('Output:', getJSON(PrimitiveErrorSerializer.serialize(error)));

  // Output: {
  //  errors: [ { code: 'Error', detail: 'badness' } ],
  //  jsonapi: { version: '1.0' }
  // }
})();
```

### Caching

The [`Cache`](https://mathematic-inc.github.io/ts-japi/classes/cache.html) class can be placed in a
[`Serializer`](https://mathematic-inc.github.io/ts-japi/classes/serializer.html)'s
[`cache`](https://mathematic-inc.github.io/ts-japi/interfaces/serializeroptions.html#cache) option.
Alternatively, setting that option to `true` will provide a default
[`Cache`](https://mathematic-inc.github.io/ts-japi/classes/cache.html).

The default [`Cache`](https://mathematic-inc.github.io/ts-japi/classes/cache.html) uses the basic
[`Object.is`](https://mathematic-inc.github.io/ts-japi/https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
function to determine if input data are the same. If you want to adjust this, instantiate a new
[`Cache`](https://mathematic-inc.github.io/ts-japi/classes/cache.html) with a
[`resolver`](https://mathematic-inc.github.io/ts-japi/interfaces/cacheoptions.html#resolver).

## Deserialization

We stress the following: Given that there are many clients readily built to consume JSON:API
endpoints (see [here](https://jsonapi.org/implementations/)), we do not provide deserialization. In
particular, since unmarshalling data is strongly related to the code it will be used in (e.g.
React), tighter integration is recommended over an unnecessary abstraction.

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

> What is "resource recursion"?<a id="wirr"></a>

Due to [compound documents](https://jsonapi.org/format/#document-compound-documents), it is possible
to recurse through related resources via their
[resource linkages](https://jsonapi.org/format/#document-resource-object-linkage) and obtain
[included resources](https://jsonapi.org/format/#document-top-level) beyond primary data relations.
This is should be done with caution (see
[`SerializerOptions.depth`](https://mathematic-inc.github.io/ts-japi/interfaces/serializeroptions.html#depth)
and
[this example](https://github.com/mathematic-inc/ts-japi/blob/master/examples/resource-recursion.example.ts))

## For Developers

To get started in developing this library, run `yarn install`, `yarn build` and `yarn test` (in this
precise order) to assure everything is in working order.

## Contributing

This project is maintained by the author, however contributions are welcome and appreciated. You can
find TS:JAPI on GitHub:
[https://github.com/mathematic-inc/ts-japi](https://github.com/mathematic-inc/ts-japi)

Feel free to submit an issue, but please do not submit pull requests unless it is to fix some issue.
For more information, read the
[contribution guide](https://github.com/mathematic-inc/ts-japi/blob/master/CONTRIBUTING.html).

## License

Copyright © 2020 [mathematic-inc](https://github.com/mathematic-inc).

Licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
