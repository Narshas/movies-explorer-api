const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { OK, CREATED } = require('../errors/errors');

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
      // if (err.name === 'ValidationError') {
      //   next(new BadRequestError('data is incorrect'));
      // } else if (err.code === 11000) {
      //   next(new ConflictError('user already exists'));
      // } else {
      //   next(err);
      // }
    })
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.
};

const getProfile = (req, res, next) => {

}:

const patchProfile = (req, res, next) => {

};