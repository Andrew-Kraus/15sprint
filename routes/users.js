const userRouter = require('express').Router();
const validator = require('validator');
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
    userId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getUserId);

userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]{2,}(\/([a-z]+\/){1,})?|https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]+0?[1-9]+0?([1-9]{1})?((\/[a-z]+){1,})?#?|https?:\/\/[a-z0-9]+\.[a-z]{2,}:[1-9]{1}0?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), createUser);

userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), login);

module.exports = userRouter;
