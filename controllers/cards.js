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
        next(new BadReqErr('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card === null) {
        throw new NotFoundErr('Карточка не найдена');
      } else if (req.user._id !== String(card.owner)) {
        throw new NotEnoughRights('У вас недостаточно прав');
      } else {
        card.remove().then((delCard) => res.send(delCard));
      }
    })
    .catch(next);
};
