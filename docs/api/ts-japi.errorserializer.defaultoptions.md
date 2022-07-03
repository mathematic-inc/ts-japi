---
sidebar_label: ErrorSerializer.defaultOptions
---
# ErrorSerializer.defaultOptions property

Default options. Can be edited to change default options globally.

**Signature:**

```typescript
class ErrorSerializer {static defaultOptions: {
        version: string;
        attributes: {
            id: string;
            status: string;
            code: string;
            title: string;
            detail: string;
            source: {
                pointer: string;
                parameter: undefined;
            };
        };
        metaizers: {};
        linkers: {};
    };}
```
