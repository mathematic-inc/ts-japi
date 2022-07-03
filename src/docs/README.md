<br />
<img src="https://raw.githubusercontent.com/mathematic-inc/ts-japi/master/docs/assets/images/logo.svg" alt="{ts:japi}" width="350"/>
<br/><br/>

![node-current](https://img.shields.io/node/v/ts-japi)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> A highly-modular (typescript-friendly)-framework agnostic library for serializing data to the JSON:API specification

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

- This is the **only** typescript-compatible library that fully types the JSON:API specification and performs *proper* serialization. 
- [**Zero dependencies**](#zdg).
- This is the **only** library with [resource recursion](#wirr).
- The modular framework laid out here *highly promotes* the specifications intentions:
  - Using links is no longer obfuscated.
  - Meta can truly be placed anywhere with possible dependencies laid out visibly.
- This library is designed to adhere to the specifications "never remove, only add" policy, so we will remain backwards-compatible.

## Documentation

The [documentation](https://mathematic-inc.github.io/ts-japi) has everything that is covered here and more.

## Installation

You can install ts-japi in your project's directory as usual:

```bash
npm install ts-japi
```

## Getting Started

There are fives classes that are used to serialize data (only one of which is necessarily required).

- {@link Serializer} with {@link SerializerOptions}
- {@link Relator} with {@link RelatorOptions}
- {@link Linker} with {@link LinkerOptions}
- {@link Metaizer}
- {@link Paginator}
- {@link ErrorSerializer} with {@link ErrorSerializerOptions}
- **NEW** {@link Cache} with {@link CacheOptions}

You can check the [documentation](https://mathematic-inc.github.io/ts-japi) for a deeper insight into the usage.

### Examples

You can check the [examples](https://github.com/mathematic-inc/ts-japi/tree/master/examples) and the [test](https://github.com/mathematic-inc/ts-japi/tree/master/test) folders to see some examples (such as the ones below). You can check [this example](https://github.com/mathematic-inc/ts-japi/blob/master/examples/full.example.ts) to see almost every option of {@link Serializer} exhausted.

## Serialization

The {@link Serializer} class is the only class required for basic serialization.

The following example constructs the most basic {@link Serializer}: (Note the `await`)

```typescript
[[include:serializer.example.ts]]
```

### Links

The {@link Linker} class is used to generate a normalized [document link](https://jsonapi.org/format/#document-links). Its methods are not meant to be called. See the [FAQ](#faq) for reasons.

The following example constructs a {@link Linker} for `User`s and `Article`s:

```typescript
[[include:linker.example.ts]]
```

#### Pagination

The {@link Paginator} class is used to generate [pagination links](https://jsonapi.org/format/#fetching-pagination). Its methods are not meant to be called.

The following example constructs a {@link Paginator}:

```typescript
[[include:paginator.example.ts]]
```

### Relationships

The {@link Relator} class is used to generate top-level [included data](https://jsonapi.org/format/#document-top-level) as well as resource-level [relationships](https://jsonapi.org/format/#document-resource-object-relationships). Its methods are not meant to be called.

{@link Relator}s may also take optional {@link Linker}s (using the {@link RelatorOptions.linkers | linker} option) to define [relationship links](https://jsonapi.org/format/#document-resource-object-relationships) and [related resource links](https://jsonapi.org/format/#document-resource-object-related-resource-links).

The following example constructs a {@link Relator} for `User`s and `Article`s:

```typescript
[[include:relator.example.ts]]
```

### Metadata

The {@link Metaizer} class is used to construct generate metadata given some dependencies. There are several locations {@link Metaizer} can be used:

- {@link ErrorSerializerOptions.metaizers}
- {@link RelatorOptions.metaizer}
- {@link SerializerOptions.metaizers}
- {@link LinkerOptions.metaizer}

Like {@link Linker}, its methods are not meant to be called.

The following example constructs a {@link Metaizer}:

```typescript
[[include:metaizer.example.ts]]
```

### Serializing Errors

The {@link ErrorSerializer} class is used to serialize any object considered an error (the {@link ErrorSerializerOptions.attributes | attributes} option allows you to choose what attributes to use during serialization). *Alternatively* (**recommended**), you can construct custom errors by extending the {@link JapiError} class and use those for all server-to-client errors.

The [error serializer test](https://github.com/mathematic-inc/ts-japi/tree/master/test/error-serializer.test.ts) includes an example of the alternative solution.

The following example constructs the most basic {@link ErrorSerializer}: (Note the lack of `await`)

```typescript
[[include:error-serializer.example.ts]]
```

### Caching

The {@link Cache} class can be placed in a {@link Serializer}'s {@link SerializerOptions.cache | cache} option. Alternatively, setting that option to `true` will provide a default {@link Cache}.

The default {@link Cache} uses the basic [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) function to determine if input data are the same. If you want to adjust this, instantiate a new {@link Cache} with a {@link CacheOptions.resolver | resolver}.

## Deserialization

We stress the following: Given that there are many clients readily built to consume JSON:API endpoints (see [here](https://jsonapi.org/implementations/)), we do not provide deserialization. In particular, since unmarshalling data is strongly related to the code it will be used in (e.g. React), tighter integration is recommended over an unnecessary abstraction.

## Remarks

There are several model classes used inside TS:JAPI such as `Resource` and `Relationships`. These models are used for normalization as well as traversing a JSON:API document. If you plan to fork this repo, you can extend these models and reimplement them to create your own custom (non-standard, extended) serializer.

## FAQ

> Why not just allow optional functions that return the internal `Link` Class (or just a URI `string`)?

The `Link` class is defined to be as general as possible in case of changes in the specification. In particular, the implementation of metadata and the types in our library rely on the generality of the `Link` class. Relying on user arguments will generate a lot of overhead for both us and users whenever the specs change.

> Why does the `Meta` class exist if it is essentially just a plain object?

In case the specification is updated to change the meta objects in some functional way.

> What is "resource recursion"?<a id="wirr"></a>

Due to [compound documents](https://jsonapi.org/format/#document-compound-documents), it is possible to recurse through related resources via their [resource linkages](https://jsonapi.org/format/#document-resource-object-linkage) and obtain [included resources](https://jsonapi.org/format/#document-top-level) beyond primary data relations. This is should be done with caution (see {@link SerializerOptions.depth} and [this example](https://github.com/mathematic-inc/ts-japi/blob/master/examples/resource-recursion.example.ts))

## For Developers

To get started in developing this library, run `yarn install`, `yarn build` and `yarn test` (in this precise order) to assure everything is in working order.

## Contributing

This project is maintained by the author, however contributions are welcome and appreciated.
You can find TS:JAPI on GitHub: [https://github.com/mathematic-inc/ts-japi](https://github.com/mathematic-inc/ts-japi)

Feel free to submit an issue, but please do not submit pull requests unless it is to fix some issue.
For more information, read the [contribution guide](https://github.com/mathematic-inc/ts-japi/blob/master/CONTRIBUTING.md).

## License

Copyright © 2020 [mathematic-inc](https://github.com/mathematic-inc).

Licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
