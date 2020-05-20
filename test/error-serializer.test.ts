import { ErrorSerializer, JAPIError, Linker, Metaizer } from "../lib";
import { ErrorDocument } from "../lib/interfaces/document.interface";
import { getJSON } from "./utils/get-json";

const domain = "https://www.example.com";
const pathTo = (path: string) => domain + path;

class CustomForbiddenError extends JAPIError {
 public constructor(message?: string) {
  super({
   status: 403,
   code: "CustomForbiddenError",
   title: "Custom Forbidden Error",
   detail: message,
  });
 }
}

describe("Error Serializer Tests", () => {
 describe("Invalid Serializer Tests", () => {});
 describe.each([
  [
   undefined,
   Error,
   (error: any) => ({
    jsonapi: { version: "1.0" },
    errors: [{ code: "Error", detail: "This is a test." }],
   }),
  ],
  [
   {
    linkers: {
     about: new Linker((error) => pathTo("/get-help-here")),
    },
    metaizers: {
     jsonapi: new Metaizer(() => ({
      somefiller: "nothing really fascinating",
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
     version: "1.0",
     meta: { somefiller: "nothing really fascinating" },
    },
    errors: [
     {
      status: error.status,
      code: error.code,
      title: error.title,
      detail: error.detail,
      links: { about: pathTo("/get-help-here") },
      meta: { createdAt: expect.any(String) },
     },
    ],
    meta: { requestedAt: expect.any(String) },
   }),
  ],
 ])("With Options %o", (options, ErrorType, expectedFrom) => {
  let PrimitiveErrorSerializer: ErrorSerializer<any>;
  it("should construct a Serializer", () => {
   expect(() => (PrimitiveErrorSerializer = new ErrorSerializer(options))).not.toThrow();
  });
  it("tests a Serializer on User ID %s", () => {
   // Get dummy data.
   const error = new ErrorType("This is a test.");

   // Testing methods
   let document: ErrorDocument;
   expect(() => (document = PrimitiveErrorSerializer.serialize(error))).not.toThrow();

   // Test JSON
   expect(getJSON(document)).toEqual(expectedFrom(error));
  });
 });
});
