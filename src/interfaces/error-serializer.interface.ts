import Linker from '../classes/linker';
import Metaizer from '../classes/metaizer';
import JapiError from '../models/error.model';
import { Dictionary } from '../types/global.types';

export interface ErrorAttributeOption<T> {
  /**
   * A unique identifier for this particular occurrence of the problem.
   *
   * @default `"id"`
   */
  id: keyof T;

  /**
   * The HTTP status code applicable to this problem.
   *
   * @default `"code"`
   */
  status: keyof T;

  /**
   * An application-specific error code.
   *
   * @default `"name"`
   */
  code: keyof T;

  /**
   * A short, human-readable summary of the problem that SHOULD NOT change from
   * occurrence to occurrence of the problem, except for purposes of
   * localization.
   *
   * @default `"reason"`
   */
  title: keyof T;

  /**
   * A human-readable explanation specific to this occurrence of the problem.
   * Like title, this field’s value can be localized.
   *
   * @default `"message"`
   */
  detail: keyof T;

  /**
   * An object containing references to the source of the error, optionally
   * including any of the following members.
   */
  source: Partial<ErrorSourceAttribute<T>>;
}

export interface ErrorSourceAttribute<T> {
  /**
   * A JSON Pointer [RFC6901] to the associated entity in the request document
   * [e.g. `/data` for a primary data object, or `/data/attributes/title` for a
   * specific attribute].
   *
   * @default `"location"`
   */
  pointer: keyof T;

  /**
   * A string indicating which URI query parameter caused the error.
   *
   * @default `undefined`
   */
  parameter: keyof T;
}

export interface ErrorSerializerOptions<T extends Dictionary<any>> {
  /**
   * The highest JSON API version supported.
   *
   * @default `1.0`
   */
  version: string | null;

  /**
   * An object of attribute names to use in place of the
   * {@linkcode ErrorAttributeOption | default ones}.
   */
  attributes: Partial<ErrorAttributeOption<T>>;

  /**
   * A set of options for constructing [top-level links](https://jsonapi.org/format/#document-top-level).
   */
  linkers: {
    /**
     * A {@linkcode Linker} that gets the [about link](https://jsonapi.org/format/#errors) for an error.
     */
    about?: Linker<[JapiError]>;
  };

  /**
   * A dictionary of {@linkcode Metaizer}s to use in different locations of the document.
   */
  metaizers: {
    /**
     * Constructs metadata for the [JSON:API Object](https://jsonapi.org/format/#document-jsonapi-object).
     */
    jsonapi?: Metaizer<[]>;

    /**
     * Constructs metadata for the [top level](https://jsonapi.org/format/#document-top-level).
     */
    document?: Metaizer<[JapiError[]]>;

    /**
     * Constructs metadata for the [error objects](https://jsonapi.org/format/#errors)
     */
    error?: Metaizer<[JapiError]>;
  };
}
