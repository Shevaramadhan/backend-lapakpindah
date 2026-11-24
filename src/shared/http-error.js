// Error dengan status HTTP, dilempar dari controller/validator dan
// diubah menjadi respons JSON { message, errors? } oleh errorHandler.
export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
