const { ERROR_DEFAULT } = require('../errors/errors');

const error = (err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT, message } = err;

  res.status(statusCode).send({
    message: statusCode === ERROR_DEFAULT ? 'error on server' : message,
  });
  next();
};

module.exports = error;
