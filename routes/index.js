const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const userRoutes = require('./users');
// const movieRoutes = require('./movies');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/error-not-found');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use(auth);
router.use('/users', userRoutes);
// router.use('/movies', movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('we dont have it'));
});

module.exports = router;
