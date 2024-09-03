// src/error/response-error.js
class ResponseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export { ResponseError };
