---
sidebar_label: JapiError.isLikeJapiError
---

# JapiError.isLikeJapiError() method

Tests whether `error` has similar attributes to a JapiError

**Signature:**

```typescript
class JapiError {
  static isLikeJapiError(error: unknown): error is Partial<JapiError>;
}
```

## Parameters

| Parameter | Type    | Description       |
| --------- | ------- | ----------------- |
| error     | unknown | An unknown object |

**Returns:**

error is Partial&lt;JapiError&gt;
