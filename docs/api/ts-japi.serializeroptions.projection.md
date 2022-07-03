---
sidebar_label: SerializerOptions.projection
---
# SerializerOptions.projection property

An object of 0 \*OR\* 1 (\*\*NOT BOTH\*\*) to denote hide or show attributes respectively.

If set (directly) to `undefined`, then the `attributes` field will be left `undefined`. If set to `null`, then every attribute will show. If set to `{}`, then every attribute will hide.

 `null`

**Signature:**

```typescript
interface SerializerOptions {projection: Partial<Record<keyof PrimaryType, 0 | 1>> | null | undefined;}
```
