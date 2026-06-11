export class TErrorWithCause extends Error {
  override cause?: TErrorWithCause | Error;

  constructor(message: string, cause?: TErrorWithCause | Error) {
    super(message);
    this.name = 'ErrorWithCause';

    if (cause) {
      this.cause = cause;
    }
  }
}

export function toError(value: unknown): Error | undefined {
  return value instanceof Error ? value : undefined;
}
