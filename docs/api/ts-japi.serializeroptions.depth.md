---
sidebar_label: SerializerOptions.depth
---
# SerializerOptions.depth property

Determines the depth of `relator`s to use for \[included resources\](https://jsonapi.org/format/\#document-compound-documents).

\*\*PLEASE TAKE CAUTION\*\*: If this property is `Infinity`, performance can degrade \*\*significantly\*\*. It is \*RECOMMENDED\* to use more requests rather than a single one if such depth is required since included resources can be \*\*inhomogenous\*\* thus difficult to traverse.

Must be a number in `[0, Infinity]`.

 `0`

**Signature:**

```typescript
interface SerializerOptions {depth: number;}
```
