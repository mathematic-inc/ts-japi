---
sidebar_label: VariadicFunction
---
# VariadicFunction type

A function that takes several arguments and outputs something.

**Signature:**

```typescript
export declare type VariadicFunction<Dependencies extends any[], ReturnType> = (...dependencies: Dependencies) => ReturnType;
```
