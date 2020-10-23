const Card = require('../models/card');
const BadReqErr = require('../errors/BadReqErr');
const NotFoundErr = require('../errors/NotFoundErr');
const NotEnoughRights = require('../errors/NotEnoughRights');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqErr('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (req.user._id !== card.owner) {
        throw new NotEnoughRights('У вас недостаточно прав');
      } else {
        Card.deleteOne({ _id: req.params.id })
        // eslint-disable-next-line
          .then((card) => {
            res.send({ data: card });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.message === 'notEnoughRights') {
        throw new NotEnoughRights('У вас недостаточно прав');
      } else if (err.name === 'CastError') {
        throw new BadReqErr('Переданы некорректные данные');
      } else {
        throw new NotFoundErr('Карточка не найдена');
      }
    })
    .catch(next);
};
