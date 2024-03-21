import { ErrorSerializer, JapiError, Linker, Metaizer } from '../lib';
import { ErrorDocument } from '../lib/interfaces/json-api.interface';
import { getJSON } from './utils/get-json';

const domain = 'https://www.example.com';
const pathTo = (path: string) => domain + path;

class CustomForbiddenError extends JapiError {
  public constructor(message?: string) {
    super({
      status: 403,
      code: 'CustomForbiddenError',
      title: 'Custom Forbidden Error',
      detail: message,
      source: {
        pointer: 'perhaps/in/response/body',
        parameter: 'some-query-param',
        header: 'some-header',
      },
    });
  }
}

describe('Error Serializer Tests', () => {
  describe('Invalid Serializer Tests', () => {});
  describe.each([
    [
      undefined,
      Error,
      () => ({
        jsonapi: { version: '1.0' },
        errors: [{ code: 'Error', detail: 'This is a test.' }],
      }),
    ],
    [
      {
        attributes: {
          id: 'name',
          status: 'name',
          title: 'name',
          source: {
            pointer: 'name',
            parameter: 'name',
            header: 'name',
          },
        },
      },
      Error,
      () => ({
        jsonapi: { version: '1.0' },
        errors: [
          {
            code: 'Error',
            detail: 'This is a test.',
            id: 'Error',
            source: { header: 'Error', parameter: 'Error', pointer: 'Error' },
            status: 'Error',
            title: 'Error',
          },
        ],
      }),
    ],
    [
      {
        attributes: { code: undefined, detail: undefined, source: undefined },
      },
      Error,
      () => ({
        jsonapi: { version: '1.0' },
        errors: [{}],
      }),
    ],
    [
      {
        linkers: {
          about: new Linker((error) => pathTo('/get-help-here')),
        },
        metaizers: {
          jsonapi: new Metaizer(() => ({
            somefiller: 'nothing really fascinating',
          })),
          document: new Metaizer(() => ({
            requestedAt: new Date(),
          })),
          error: new Metaizer((error) => ({
            createdAt: new Date(),
          })),
        },
      },
      CustomForbiddenError,
      (error: any) => ({
        jsonapi: {
          version: '1.0',
          meta: { somefiller: 'nothing really fascinating' },
        },
        errors: [
          {
            status: error.status,
            code: error.code,
            title: error.title,
            detail: error.detail,
            links: { about: pathTo('/get-help-here') },
            meta: { createdAt: expect.any(String) },
            source: {
              parameter: 'some-query-param',
              pointer: 'perhaps/in/response/body',
              header: 'some-header',
            },
          },
        ],
        meta: { requestedAt: expect.any(String) },
      }),
    ],
  ])('With Options %o', (options, ErrorType, expectedFrom) => {
    let PrimitiveErrorSerializer: ErrorSerializer<any>;

    it('should construct a ErrorSerializer', () => {
      expect(() => (PrimitiveErrorSerializer = new ErrorSerializer(options))).not.toThrow();
    });

    it('tests a ErrorSerializer on User ID %s', () => {
      // Get dummy data.
      const error = new ErrorType('This is a test.');

      // Testing methods
      let document: ErrorDocument | undefined;

      expect(() => (document = PrimitiveErrorSerializer.serialize(error))).not.toThrow();
      expect(() => (document = PrimitiveErrorSerializer.serialize([error]))).not.toThrow();

      // Test JSON
      expect(getJSON(document)).toEqual(expectedFrom(error));
    });
  });
});
