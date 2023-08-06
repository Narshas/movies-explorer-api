const { ERROR_NOTAUTH } = require('./errors');

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOTAUTH;
  }
}

module.exports = NotAuthorizedError;
