const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/error-bad-request');
const NotFoundError = require('../errors/error-not-found');
const ConflictError = require('../errors/error-conflict');

const { OK, CREATED } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('data is incorrect'));
      } else if (err.code === 11000) {
        next(new ConflictError('user already exists'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      console.log('значение для генерации JWT:', NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      console.log('токен:', token);
      res.status(OK).send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  console.log('getCurrentUser called:', req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('we dont have it');
      }
      res.status(OK).send(user);
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('we dont have it');
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('data is incorrect'));
      } else if (err.code === 11000) {
        next(new ConflictError('user already exists'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getCurrentUser, patchUser,
};
