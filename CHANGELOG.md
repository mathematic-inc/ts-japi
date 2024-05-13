# Changelog

## [1.11.4](https://github.com/mathematic-inc/ts-japi/compare/v1.11.3...v1.11.4) (2024-05-13)


### Bug Fixes

* [#92](https://github.com/mathematic-inc/ts-japi/issues/92) re-sort data after serialization ([#93](https://github.com/mathematic-inc/ts-japi/issues/93)) ([aeae3a7](https://github.com/mathematic-inc/ts-japi/commit/aeae3a7aacf2c2e9c514f982070ba4d1b8fe6727))

## [1.11.3](https://github.com/mathematic-inc/ts-japi/compare/v1.11.2...v1.11.3) (2024-04-19)


### Bug Fixes

* **issue 89:** conditional logic handling links ([#90](https://github.com/mathematic-inc/ts-japi/issues/90)) ([a13aff9](https://github.com/mathematic-inc/ts-japi/commit/a13aff9c317cd6871ef21141b1bf594254aec878))

## [1.11.2](https://github.com/mathematic-inc/ts-japi/compare/v1.11.1...v1.11.2) (2024-04-18)


### Bug Fixes

* better support for polymorphic inputs ([#87](https://github.com/mathematic-inc/ts-japi/issues/87)) ([f29f835](https://github.com/mathematic-inc/ts-japi/commit/f29f835e39a397cd9357fd55ccb8fe982bca06ec))

## [1.11.1](https://github.com/mathematic-inc/ts-japi/compare/v1.11.0...v1.11.1) (2024-04-17)


### Bug Fixes

* correctly serialize input array as array ([#84](https://github.com/mathematic-inc/ts-japi/issues/84)) ([37becd6](https://github.com/mathematic-inc/ts-japi/commit/37becd6ff307cf9ac1e47f1ec40c3e3e9ff09c90))

## [1.11.0](https://github.com/mathematic-inc/ts-japi/compare/v1.10.1...v1.11.0) (2024-04-08)


### Features

* serialize polymorphic documents ([#81](https://github.com/mathematic-inc/ts-japi/issues/81)) ([52e60b1](https://github.com/mathematic-inc/ts-japi/commit/52e60b19e44bca1afa1220afaf29cac4ee976482))

## [1.10.1](https://github.com/mathematic-inc/ts-japi/compare/v1.10.0...v1.10.1) (2024-04-06)


### Bug Fixes

* bump for PR ([173364f](https://github.com/mathematic-inc/ts-japi/commit/173364f99041229747d53e9603c0f84985614156))

## [1.10.0](https://github.com/mathematic-inc/ts-japi/compare/v1.9.1...v1.10.0) (2024-03-21)


### Features

* add header to the source object ([#73](https://github.com/mathematic-inc/ts-japi/issues/73)) ([d5c1cbe](https://github.com/mathematic-inc/ts-japi/commit/d5c1cbefa7231336bde9436f8c3805e1cbd3e366))

## [1.9.1](https://github.com/mathematic-inc/ts-japi/compare/v1.9.0...v1.9.1) (2023-10-11)


### Bug Fixes

* fix logic where nested includes were not calculated correctly. Fixes [#68](https://github.com/mathematic-inc/ts-japi/issues/68) ([#69](https://github.com/mathematic-inc/ts-japi/issues/69)) ([701a7e6](https://github.com/mathematic-inc/ts-japi/commit/701a7e61d8239abbe54ba88bcf65f8fb7552ad79))

## [1.9.0](https://github.com/mathematic-inc/ts-japi/compare/v1.8.1...v1.9.0) (2023-09-04)


### Features

* add polymprphic serializer ([#66](https://github.com/mathematic-inc/ts-japi/issues/66)) ([d440f87](https://github.com/mathematic-inc/ts-japi/commit/d440f87d7241cc2b52db1440b66f87112e0a3807))

## [1.8.1](https://github.com/mathematic-inc/ts-japi/compare/v1.8.0...v1.8.1) (2023-08-10)


### Bug Fixes

* allow relator serializer to be a getter ([#63](https://github.com/mathematic-inc/ts-japi/issues/63)) ([a55b4e9](https://github.com/mathematic-inc/ts-japi/commit/a55b4e9b7c36b28087397973eee6025db7d6299b))

## [1.8.0](https://github.com/mathematic-inc/ts-japi/compare/v1.7.0...v1.8.0) (2022-09-30)


### Features

* implement support for the `include` spec ([#53](https://github.com/mathematic-inc/ts-japi/issues/53)) ([fe4f276](https://github.com/mathematic-inc/ts-japi/commit/fe4f276cb2338b7540a17308cb020ca6e1bd5478))

## [1.7.0](https://github.com/mathematic-inc/ts-japi/compare/v1.6.3...v1.7.0) (2022-08-05)


### Bug Fixes

* ignore relationships if they're not set to support optional relations ([#49](https://github.com/mathematic-inc/ts-japi/issues/49)) ([7bd7d53](https://github.com/mathematic-inc/ts-japi/commit/7bd7d5372c96841583dce9bd01a8bbb4cb220b8e))

## 1.6.2

### Patch Changes

- c5a8201: Add customisable relationship names

## 1.6.1

### Patch Changes

- d5cd4d1: Updated dependencies

## 1.6.0

### Minor Changes

- bd4c358: Add `relatorDataCache` in serialize method to avoid duplicate lookups during
  `recurseRelators` call

## 1.5.1

### Patch Changes

- e81d1b1: Adds assertions to issue-23 test (testing depth > 1)
- Fixes #24

## 1.5.0

### Minor Changes

- Fixes https://github.com/mathematic-inc/ts-japi/issues/23

## 1.4.0

### Minor Changes

- 3dc7c4c: Allow null for empty to-one relationships

## [1.3.0] - 2020-06-23

### Added

- Added an `isErrorDocument` function to detect JSON:API Error documents. This function allows you
  to treat the argument _as if it were an error document_ (there is obviously no way to know if it
  really is a JSON:API error document at runtime).
- Added an `isLikeJapiError` function to detect JSON:API Error. This function allows you to treat
  the argument _as if it were an JSON:API error_ (there is obviously no way to know if it really is
  a JSON:API error at runtime).

### Changed

- Exported a `isPlainObject` and `isObjectObject` functions from internal.

## [1.2.7] - 2020-06-22

- Fix for #10
- Fix for #11

## [1.2.6] - 2020-06-19

### Changed

- Changed user-level repo to org-level repo.
  - Links have been fixed in docs and README

## [1.2.5] - 2020-06-19

### Changed

- Exported interfaces related to JSON:API.
  - The Error and Data document interfaces now require the "errors" and "data" properties
    respectively.
  - The Base document interface has been abstracted further by removing the "meta" property.
  - A _new_ Meta document interface is now available for type-checking.

## [1.2.4] - 2020-06-19

### Changed

- Smaller packaging

## [1.2.3] - 2020-06-06

### Changed

- Updated license to Apache 2.0
- Fixed some grammatical errors in README

## [1.2.2] - 2020-05-27

### Added

- A new `Cache` class is now available to use for caching. You can set this in the `cache` option
  for a `Serializer` (use `true` if you want the built in cache).
- With caching, there is a ~586% speed improvement (412,768 ops/sec over the previous 70,435
  ops/sec). Without-caching rates have stayed the same.

## [1.2.1] - 2020-05-27

### Added

- More keywords to `package.json` to help user search for this package.

## [1.2.0] - 2020-05-26

So, `ts-japi` has only been released a few days, but after some significant use in my APIs, I have
realized a few things:

1. Linkers and certain classes should be allowed to parse `nullish` data (`nullish` meaning
   `undefined` or `null`).
2. The `relationships object` should be allowed to have custom keys, not dependent on the `relators`
   options
   - `Relator`s should always have a `Serializer`; otherwise, they wouldn't relate to any `resource`
     per se.
3. Projections should be "choose included" or "choose excluded" similar to MongoDB's.
4. The code can be faster.

With this in mind, here are the changes.

### Changed

- **[Breaking Change]** Every relator must define a `Serializer` as the second argument in its
  constructor (as opposed to the relator's options. Options can go in the third argument.
  - It may be subtle, but the reason for this lies in the fact `relationships object` must be keyed
    by the related object. If the relator has no serializer, then the relator has no related name,
    hence there is no canonical way to key the relationship.
  - We will now allow objects of relators to be defined as an option for `relators` on
    `Serializer`s. By using objects, the key for the relationship generated by the relator will
    correspond to the same key for that of the relator's.
- Several functional options now allow for `nullish` (`null` or `undefined`) arguments:
  - Resource Linkers can now type-safely use `nullish` arguments.
  - Resource Metaizers can now type-safely use `nullish` arguments.
- Several plain options now allow for `nullish` (`null` or `undefined`):
  - Serializer `projection` option has changed significantly (see the option itself) with `nullish`
    values.
- There is a ~33% speed improvement. (70,435 ops/sec over 52,843 ops/sec on a low-end Macbook Pro
  15")

### Added

- Started a CHANGELOG to keep users updated.

#### Important Note

I want to say this IS unusual to have a breaking change without depreciation, but given the fact
this package is only a few days old, I want to apologize if you are bothered by the above break.
However, I will guarantee that API changes will go through depreciation before removal, so happy
coding :)
