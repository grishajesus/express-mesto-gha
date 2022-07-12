const ApiError = require('./ApiError');
const { ERROR_CODES } = require('../constants/errors');

class NotFoundError extends ApiError {
  constructor(message) {
    super({ statusCode: ERROR_CODES.notFound, message });
  }
}

module.exports = NotFoundError;
