const ApiError = require('./ApiError');
const { ERROR_CODES } = require('../constants/errors');

class ConflictError extends ApiError {
  constructor(message) {
    super({ statusCode: ERROR_CODES.conflict, message });
  }
}

module.exports = ConflictError;
