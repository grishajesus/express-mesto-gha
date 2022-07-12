const ApiError = require('./ApiError');
const { ERROR_CODES } = require('../constants/errors');

class InternalError extends ApiError {
  constructor(message) {
    super({ statusCode: ERROR_CODES.internalError, message });
  }
}

module.exports = InternalError;
