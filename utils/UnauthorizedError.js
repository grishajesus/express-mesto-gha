const ApiError = require('./ApiError');
const { ERROR_CODES } = require('../constants/errors');

class UnauthorizedError extends ApiError {
  constructor(message) {
    super({ statusCode: ERROR_CODES.unauthorized, message });
  }
}

module.exports = UnauthorizedError;
