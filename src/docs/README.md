<br />
<img src="https://raw.githubusercontent.com/jun-sheaf/ts-japi/master/docs/assets/images/logo.svg?token=AIIY45SPCCNXBN5X7P36DU26ZK2AY" alt="{ts:japi}" width="350"/>
<br/><br/>

[![Travis (.com)](https://img.shields.io/travis/com/jun-sheaf/ts-japi)](https://travis-ci.com/github/jun-sheaf/ts-japi)
[![Codecov](https://img.shields.io/codecov/c/github/jun-sheaf/ts-japi?token=NR90UY1SAF)](https://codecov.io/gh/jun-sheaf/ts-japi)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/jun-sheaf/ts-japi)](https://snyk.io/test/github/jun-sheaf/ts-japi)
![node-current](https://img.shields.io/node/v/ts-japi)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

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

The [documentation](https://jun-sheaf.github.io/ts-japi) has everything that is covered here and more.

## Installation

You can install ts-japi in your project's directory as usual:

```bash
npm install ts-japi
```

## Getting Started

There are fives classes that are used to serialize data (only one of which is necessarily required).

- {@linkcode Serializer} with {@linkcode SerializerOptions}
- {@linkcode Relator} with {@linkcode RelatorOptions}
- {@linkcode Linker} with {@linkcode LinkerOptions}
- {@linkcode Metaizer}
- {@linkcode Paginator}
- {@linkcode ErrorSerializer} with {@linkcode ErrorSerializerOptions}
- **NEW** {@linkcode Cache} with {@linkcode CacheOptions}

You can check the [documentation](https://jun-sheaf.github.io/ts-japi) for a deeper insight into the usage.

### Examples

You can check the [examples](https://github.com/jun-sheaf/ts-japi/tree/master/examples) and the [test](https://github.com/jun-sheaf/ts-japi/tree/master/test) folders to see some examples (such as the ones below). You can check [this example](https://github.com/jun-sheaf/ts-japi/blob/master/examples/full.example.ts) to see almost every option of {@linkcode Serializer} exhausted.

## Serialization

The {@linkcode Serializer} class is the only class required for basic serialization.

The following example constructs the most basic {@linkcode Serializer}: (Note the `await`)

```typescript
[[include:serializer.example.ts]]
```

### Links

The {@linkcode Linker} class is used to generate a normalized [document link](https://jsonapi.org/format/#document-links). Its methods are not meant to be called. See the [FAQ](#faq) for reasons.

The following example constructs a {@linkcode Linker} for `User`s and `Article`s:

```typescript
[[include:linker.example.ts]]
```

#### Pagination

The {@linkcode Paginator} class is used to generate [pagination links](https://jsonapi.org/format/#fetching-pagination). Its methods are not meant to be called.

The following example constructs a {@linkcode Paginator}:

```typescript
[[include:paginator.example.ts]]
```

### Relationships

The {@linkcode Relator} class is used to generate top-level [included data](https://jsonapi.org/format/#document-top-level) as well as resource-level [relationships](https://jsonapi.org/format/#document-resource-object-relationships). Its methods are not meant to be called.

{@linkcode Relator}s may also take optional {@linkcode Linker}s (using the {@linkcode RelatorOptions.linkers | linker} option) to define [relationship links](https://jsonapi.org/format/#document-resource-object-relationships) and [related resource links](https://jsonapi.org/format/#document-resource-object-related-resource-links).

The following example constructs a {@linkcode Relator} for `User`s and `Article`s:

```typescript
[[include:relator.example.ts]]
```

### Metadata

The {@linkcode Metaizer} class is used to construct generate metadata given some dependencies. There are several locations {@linkcode Metaizer} can be used:

- {@linkcode ErrorSerializerOptions.metaizers}
- {@linkcode RelatorOptions.metaizer}
- {@linkcode SerializerOptions.metaizers}
- {@linkcode LinkerOptions.metaizer}

Like {@linkcode Linker}, its methods are not meant to be called.

The following example constructs a {@linkcode Metaizer}:

```typescript
[[include:metaizer.example.ts]]
```

### Serializing Errors

The {@linkcode ErrorSerializer} class is used to serialize any object considered an error (the {@linkcode ErrorSerializerOptions.attributes | attributes} option allows you to choose what attributes to use during serialization). *Alternatively* (**recommended**), you can construct custom errors by extending the {@linkcode JapiError} class and use those for all server-to-client errors.

The [error serializer test](https://github.com/jun-sheaf/ts-japi/tree/master/test/error-serializer.test.ts) includes an example of the alternative solution.

The following example constructs the most basic {@linkcode ErrorSerializer}: (Note the lack of `await`)

```typescript
[[include:error-serializer.example.ts]]
```

### Caching

The {@linkcode Cache} class can be placed in a {@linkcode Serializer}'s {@linkcode SerializerOptions.cache | cache} option. Alternatively, setting that option to `true` will provide a default {@linkcode Cache}.

The default {@linkcode Cache} uses the basic [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) function to determine if input data are the same. If you want to adjust this, instantiate a new {@linkcode Cache} with a {@linkcode CacheOptions.resolver | resolver}.

## Deserialization

Coming soon.

## Remarks

There are several model classes used inside TS:JAPI such as `Resource` and `Relationships`. These models are used for normalization as well as traversing a JSON:API document. If you plan to fork this repo, you can extend these models and reimplement them to create your own custom (non-standard, extended) serializer.

## FAQ

> Why not just allow optional functions that return `Link` (or just a URI `string`)?

The `Link` class is defined to be as general as possible in case of changes in the specification. In particular, the implementation of metadata and the types in our library rely on the generality of the `Link` class. Relying on user arguments will generate a lot of overhead for both us and users whenever the specs change.

> Why is the `Meta` class used if it essential is just an object?

In case the specification is updated to change the meta objects in some functional way.

> What is "resource recursion"?<a id="wirr"></a>

Due to [compound documents](https://jsonapi.org/format/#document-compound-documents), it is possible to recurse through related resources via their [resource linkages](https://jsonapi.org/format/#document-resource-object-linkage) and obtain [included resources](https://jsonapi.org/format/#document-top-level) beyond what the primary data gives. This is not preferable and should be done with caution (see {@linkcode SerializerOptions.depth} and [this example](https://github.com/jun-sheaf/ts-japi/blob/master/examples/resource-recursion.example.ts))

> Is the "zero dependencies" a gimmick?<a id="zdg"></a>

In general, some packages obtain "zero dependencies" by simply hardcoding packages into their libraries. This can sometimes lead to an undesirable bulk for final consumers of the package. For us, we just couldn't find a package that can do what we do faster. For example, even [`is-plain-object`](https://www.npmjs.com/package/is-plain-object) (which is useful, e.g., for identifying classes over "plain" objects) has some unnecessary comparisons that we optimized upon.

## Contributing

This project is maintained by the author, however contributions are welcome and appreciated.
You can find TS:JAPI on GitHub: [https://github.com/jun-sheaf/ts-japi](https://github.com/jun-sheaf/ts-japi)

Feel free to submit an issue, but please do not submit pull requests unless it is to fix some issue.
For more information, read the [contribution guide](https://github.com/jun-sheaf/ts-japi/blob/master/CONTRIBUTING.md).

## License

Copyright © 2020 [jun-sheaf](https://github.com/jun-sheaf).

Licensed under [GNU Affero General Public License v3](http://www.gnu.org/licenses/agpl-3.0).
