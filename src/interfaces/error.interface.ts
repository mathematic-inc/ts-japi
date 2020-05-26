export interface ErrorSource {
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
}

export interface ErrorOptions {
 /**
  * A unique identifier for this particular occurrence of the problem.
  */
 id?: string;

 /**
  * The HTTP status code applicable to this problem.
  */
 status?: number | string;

 /**
  * An application-specific error code.
  */
 code?: string;

 /**
  * A short, human-readable summary of the problem that SHOULD NOT change from
  * occurrence to occurrence of the problem, except for purposes of
  * localization.
  */
 title?: string;

 /**
  * A human-readable explanation specific to this occurrence of the problem.
  * Like title, this field’s value can be localized.
  */
 detail?: string;

 /**
  * An object containing references to the source of the error, optionally
  * including any of the following members.
  */
 source?: ErrorSource;
}
