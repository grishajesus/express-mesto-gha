const ApiError = require('./ApiError');
const { ERROR_CODES } = require('../constants/errors');

class ForbiddenError extends ApiError {
  constructor(message) {
    super({ statusCode: ERROR_CODES.forbidden, message });
  }
}

module.exports = ForbiddenError;
