const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  // createUser,
  getCurrentUser,
  patchUser,
} = require('../controllers/users');

// router.post('/', createUser);

router.get('/me', getCurrentUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string.require.email(),
    }),
  }),
  patchUser,
);

module.exports = router;
