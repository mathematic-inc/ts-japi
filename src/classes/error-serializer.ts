import type { ErrorSerializerOptions } from "../interfaces/error-serializer.interface";
import type { ErrorOptions, ErrorSource } from "../interfaces/error.interface";
import type { ErrorDocument } from "../interfaces/json-api.interface";
import JapiError from "../models/error.model";
import type { Dictionary, SingleOrArray } from "../types/global.types";
import merge from "../utils/merge";

/** Reads an attribute of an error as a string, or gives `undefined` when it is missing or empty. */
function readAttribute<ErrorType extends Dictionary<any>>(
  error: ErrorType,
  key: keyof ErrorType | undefined,
) {
  if (key === undefined || key === "") {
    return undefined;
  }
  const value: unknown = error[key];
  const text = String(value);
  if (
    value === undefined ||
    value === null ||
    value === false ||
    value === "" ||
    value === 0 ||
    value === 0n ||
    (typeof value === "number" && Number.isNaN(value))
  ) {
    return undefined;
  }
  return text;
}

/**
 * The {@link ErrorSerializer} class is used to serialize errors.
 *
 * Example:
 * ```typescript
 * [[include:error-serializer.example.ts]]
 * ```
 */
export default class ErrorSerializer<ErrorType extends Dictionary<any>> {
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
        header: undefined,
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
   * Creates a {@link Serializer}.
   *
   * @param collectionName - The name of the collection of objects.
   * @param options - Options for the serializer.
   */
  public constructor(options: Partial<ErrorSerializerOptions<ErrorType>> = {}) {
    // Setting default options.
    this.options = merge({}, ErrorSerializer.defaultOptions, options);
  }

  /**
   * The actual serialization function.
   *
   * @param errors - Errors to serialize.
   * @param options - Options to use at runtime.
   */
  public serialize(
    errors: SingleOrArray<ErrorType>,
    options?: Partial<ErrorSerializerOptions<ErrorType>>,
  ) {
    // Get options.
    let o = this.options;
    if (options) {
      o = merge({}, this.options, options);
    }

    const attributes = o.attributes;
    const linkers = o.linkers;
    const metaizers = o.metaizers;
    const version = o.version;

    const document: ErrorDocument = { errors: [] };

    // Normalize error input
    const normalizedErrors = Array.isArray(errors) ? errors : [errors];
    document.errors = normalizedErrors.map((e) => {
      if (e instanceof JapiError) {
        return e;
      }
      const eo: ErrorOptions = {};
      const id = readAttribute(e, attributes.id);
      if (id !== undefined) {
        eo.id = id;
      }
      const status = readAttribute(e, attributes.status);
      if (status !== undefined) {
        eo.status = status;
      }
      const code = readAttribute(e, attributes.code);
      if (code !== undefined) {
        eo.code = code;
      }
      const title = readAttribute(e, attributes.title);
      if (title !== undefined) {
        eo.title = title;
      }
      const detail = readAttribute(e, attributes.detail);
      if (detail !== undefined) {
        eo.detail = detail;
      }
      if (attributes.source) {
        const source: ErrorSource = {};
        const pointer = readAttribute(e, attributes.source.pointer);
        if (pointer !== undefined) {
          source.pointer = pointer;
        }
        const parameter = readAttribute(e, attributes.source.parameter);
        if (parameter !== undefined) {
          source.parameter = parameter;
        }
        const header = readAttribute(e, attributes.source.header);
        if (header !== undefined) {
          source.header = header;
        }
        eo.source = Object.keys(source).length === 0 ? undefined : source;
      }
      return new JapiError(eo);
    });

    // Constructing base document.
    if (typeof version === "string" && version.length > 0) {
      document.jsonapi = { version };
    }

    // Handling document metadata.
    if (metaizers.jsonapi) {
      document.jsonapi = {
        ...document.jsonapi,
        meta: metaizers.jsonapi.metaize(),
      };
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
        if (linker !== undefined) {
          for (const error of document.errors) {
            error.links = { ...error.links, [key]: linker.link(error) };
          }
        }
      }
    }

    return document;
  }
}
