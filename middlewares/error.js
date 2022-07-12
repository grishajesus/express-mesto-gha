const ApiError = require('../utils/ApiError');
const { ERROR_CODES } = require('../constants/errors');

module.exports = (error, req, res, next) => {
  if (error instanceof ApiError) {
    const { statusCode, message } = error;

    return res.status(statusCode).send({ message });
  }

  return res.status(ERROR_CODES.internalError).send({ message: 'Server Error' });
};
