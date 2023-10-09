require('dotenv').config();
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/error-not-auth');

const { NODE_ENV, JWT_SECRET } = process.env;
console.log('режим работы:', process.env.NODE_ENV);

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  console.log('Authorization Header:', authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.error('Failed at Bearer check.');
    next(new NotAuthorizedError('not authorized'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  console.log('Parsed Token:', token);

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    console.error('Token Verification Error:', err.message);
    next(new NotAuthorizedError('not authorized'));
    return;
  }

  console.log('Verification Successful, Payload:', payload);

  req.user = payload;
  next();
};

module.exports = auth;
