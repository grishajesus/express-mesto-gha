const ApiError = require('../utils/ApiError');

module.exports = ((error, _, res) => {
  if (error instanceof ApiError) {
    const { statusCode, message } = error;
    console.log('error', statusCode, message);

    return res.status(statusCode).send({ message });
  }

  return res.status(500).send({ message: error.message });
});
