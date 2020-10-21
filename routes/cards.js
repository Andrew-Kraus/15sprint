const cardRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const { getCard, deleteCard, createCard } = require('../controllers/cards');

cardRouter.get('/', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getCard);

cardRouter.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), deleteCard);

cardRouter.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(/https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]{2,}(\/([a-z]+\/){1,})?|https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]+0?[1-9]+0?([1-9]{1})?((\/[a-z]+){1,})?#?|https?:\/\/[a-z0-9]+\.[a-z]{2,}:[1-9]{1}0?/),
    owner: Joi.string().required(),
    createdAt: Joi.date(),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), createCard);

module.exports = cardRouter;
