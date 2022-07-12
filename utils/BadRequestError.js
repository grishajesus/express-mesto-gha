const ApiError = require('./ApiError');
const { ERROR_CODES } = require('../constants/errors');

class BadRequestError extends ApiError {
  constructor(message) {
    super({ statusCode: ERROR_CODES.badRequest, message });
  }
}

module.exports = BadRequestError;
