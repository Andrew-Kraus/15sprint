const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUser,
  getUserId,
  createUser,
  login,
} = require('../controllers/users');

userRouter.get('/', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getUser);

userRouter.get('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getUserId);

userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line
    avatar: Joi.string().required().regex(/https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]{2,}(\/([a-z]+\/){1,})?|https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]+0?[1-9]+0?([1-9]{1})?((\/[a-z]+){1,})?#?|https?:\/\/[a-z0-9]+\.[a-z]{2,}:[1-9]{1}0?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = userRouter;
