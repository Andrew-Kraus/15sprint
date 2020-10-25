const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');

const { getCard, deleteCard, createCard } = require('../controllers/cards');

cardRouter.get('/', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), getCard);

cardRouter.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), deleteCard);

cardRouter.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line
    link: Joi.string().required().regex(/https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]{2,}(\/([a-z]+\/){1,})?|https?:\/\/[\w\d\.-]+[:\.]{1}[a-z1-9]+0?[1-9]+0?([1-9]{1})?((\/[a-z]+){1,})?#?|https?:\/\/[a-z0-9]+\.[a-z]{2,}:[1-9]{1}0?/),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/(\w(.?)*-?)+/),
  }).unknown(true),
}), createCard);

module.exports = cardRouter;
