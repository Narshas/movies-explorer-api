const { ERROR_NOTALLOWED } = require('./errors');

class NotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOTALLOWED;
  }
}

module.exports = NotAllowedError;
