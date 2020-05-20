import { ErrorSerializerOptions } from "../interfaces/error-serializer.interface";
import { ErrorOptions } from "../interfaces/error.interface";
import { ErrorDocument } from "../interfaces/json:api.interface";
import JapiError from "../models/error.model";
import { SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";

/**
 * The {@linkcode ErrorSerializer} class is used to serialize errors.
 *
 * Example:
 * ```typescript
 * [[include:error-serializer.example.ts]]
 * ```
 */
export default class ErrorSerializer<ErrorType> {
 /**
  * Default options. Can be edited to change default options globally.
  */
 public static defaultOptions = {
  version: "1.0",
  attributes: {
   id: "id",
   status: "code",
   code: "name",
   title: "reason",
   detail: "message",
   source: {
    pointer: "location",
    parameter: undefined,
   },
  },
  metaizers: {},
  linkers: {},
 };

 /**
  * The set of options for the serializer.
  */
 private options: Readonly<ErrorSerializerOptions<ErrorType>>;

 /**
  * Creates a {@linkcode Serializer}.
  *
  * @param collectionName The name of the collection of objects.
  * @param options Options for the serializer.
  */
 public constructor(options: Partial<ErrorSerializerOptions<ErrorType>> = {}) {
  // Setting default options.
  this.options = merge({}, ErrorSerializer.defaultOptions, options);
 }

 /**
  * The actual serialization function.
  *
  * @param errors Errors to serialize.
  * @param options Options to use at runtime.
  */
 public serialize(
  errors: SingleOrArray<ErrorType>,
  options?: Partial<ErrorSerializerOptions<ErrorType>>
 ) {
  // Get options.
  let o = this.options;
  if (options) o = merge({}, this.options, options);

  const attributes = o.attributes;
  const linkers = o.linkers;
  const metaizers = o.metaizers;
  const version = o.version;

  const document: ErrorDocument = {};

  // Normalize error input
  if (!Array.isArray(errors)) {
   errors = [errors];
  }
  document.errors = errors.map((error) => {
   if (error instanceof JapiError) return error;
   const errorOptions: ErrorOptions = {};
   if (attributes.id && error[attributes.id]) {
    errorOptions.id = String(error[attributes.id]);
   }
   if (attributes.status && error[attributes.status]) {
    errorOptions.status = String(error[attributes.status]);
   }
   if (attributes.code && error[attributes.code]) {
    errorOptions.code = String(error[attributes.code]);
   }
   if (attributes.title && error[attributes.title]) {
    errorOptions.title = String(error[attributes.title]);
   }
   if (attributes.detail && error[attributes.detail]) {
    errorOptions.detail = String(error[attributes.detail]);
   }
   if (attributes.source) {
    errorOptions.source = {};
    if (attributes.source.pointer && error[attributes.source.pointer]) {
     errorOptions.source.pointer = String(error[attributes.source.pointer]);
    }
    if (attributes.source.parameter && error[attributes.source.parameter]) {
     errorOptions.source.parameter = String(error[attributes.source.parameter]);
    }
    if (Object.keys(errorOptions.source).length === 0) {
     delete errorOptions.source;
    }
   }
   return new JapiError(errorOptions);
  });

  // Constructing base document.
  document.jsonapi = { version };

  // Handling document metadata.
  if (metaizers.jsonapi) {
   document.jsonapi.meta = metaizers.jsonapi.metaize();
  }
  if (metaizers.document) {
   document.meta = metaizers.document.metaize(document.errors);
  }
  if (metaizers.error) {
   for (const error of document.errors) {
    error.meta = metaizers.error.metaize(error);
   }
  }

  // Handling links.
  if (Object.keys(linkers).length > 0) {
   for (const [key, linker] of Object.entries(linkers)) {
    if (linker) {
     for (const error of document.errors) {
      error.links = { ...error.links, [key]: linker.link(error) };
     }
    }
   }
  }

  return document;
 }
}
