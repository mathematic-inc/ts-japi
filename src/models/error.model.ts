import { Dictionary, nullish } from '..';
import { ErrorOptions } from '../interfaces/error.interface';
import Link from './link.model';
import Meta from './meta.model';
import { isObject } from '../utils/is-object';

export default class JapiError {
  /**
   * Tests whether `error` has similar attributes to a JapiError
   *
   * @param error An unknown object
   */
  public static isLikeJapiError(error: unknown): error is Partial<JapiError> {
    if (!isObject(error)) return false;
    return (
      ['id', 'status', 'code', 'title', 'detail', 'source', 'links', 'meta'].some(
        (attrName) => attrName in error
      ) &&
      [
        (['id', 'status', 'code', 'title', 'detail'] as const).every(
          (attrName) => !(attrName in error) || typeof error[attrName] === 'string'
        ),
        (['source', 'links', 'meta'] as const).every(
          (attrName) => !(attrName in error) || isObject(error[attrName])
        ),
      ].every((v) => v)
    );
  }

  /** @internal */
  public stack!: string;

  /**
   * A unique identifier for this particular occurrence of the problem.
   */
  public id?: string;

  /**
   * The HTTP status code applicable to this problem, expressed as a string
   * value.
   */
  public status?: string;

  /**
   * An application-specific error code, expressed as a string value.
   */
  public code?: string;

  /**
   * A short, human-readable summary of the problem that SHOULD NOT change from
   * occurrence to occurrence of the problem, except for purposes of
   * localization.
   */
  public title?: string;

  /**
   * A human-readable explanation specific to this occurrence of the problem.
   * Like title, this field’s value can be localized.
   */
  public detail?: string;

  /**
   * An object containing references to the source of the error, optionally
   * including any of the following members.
   */
  public source?: {
    /**
     * A JSON Pointer [RFC6901] to the associated entity in the request document
     * [e.g. `/data` for a primary data object, or `/data/attributes/title` for a
     * specific attribute].
     */
    pointer?: string;

    /**
     * A string indicating which URI query parameter caused the error.
     */
    parameter?: string;
  };

  /**
   * A links object
   */
  public links?: Dictionary<Link | nullish>;

  /**
   * A meta object containing non-standard meta information about the error.
   */
  public meta?: Meta;

  public constructor(options: ErrorOptions = {}) {
    if (options.id) this.id = options.id;
    if (options.status) this.status = options.status.toString();
    if (options.code) this.code = options.code;
    if (options.title) this.title = options.title;
    if (options.detail) this.detail = options.detail;
    if (options.source) this.source = options.source;
    Error.captureStackTrace(this, Error);
  }
}
