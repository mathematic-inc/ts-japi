import { ErrorSerializer, isErrorDocument, JapiError, isPlainObject, isObject } from '../lib';

describe('Tests some utility functions', () => {
  const serializer = new ErrorSerializer();
  const errorDocument = serializer.serialize(new Error('test'));

  test('isErrorDocument', () => {
    expect(isErrorDocument(errorDocument)).toBe(true);
    expect(isErrorDocument(new Error())).toBe(false);
  });

  test('isLikeJapiError', () => {
    expect(JapiError.isLikeJapiError(errorDocument.errors[0])).toBe(true);
    expect(JapiError.isLikeJapiError(errorDocument)).toBe(false);
    expect(JapiError.isLikeJapiError(new Error())).toBe(false);
  });

  test(`isObject & isPlainObject`, () => {
    expect(isObject({})).toBe(true);
    expect(isObject(serializer)).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(serializer)).toBe(false);
    expect(isPlainObject(null)).toBe(false);
  });
});
