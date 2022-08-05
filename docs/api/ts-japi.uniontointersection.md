---
sidebar_label: UnionToIntersection
---

# UnionToIntersection type

**Signature:**

```typescript
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
```
