export interface TErrorWithCause extends Error {
  cause?: TErrorWithCause | Error;
}
