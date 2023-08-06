const { ERROR_BAD_REQUEST } = require('./errors');

class BadRequestdError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_REQUEST;
  }
}

module.exports = BadRequestdError;
