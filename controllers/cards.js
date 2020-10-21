const Card = require('../models/card');
const BadReqErr = require('../errors/BadReqErr');
const NotFoundErr = require('../errors/NotFoundErr');

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
    .orFail(new Error('notFound'))
  // eslint-disable-next-line
    .then((card) => {
      // eslint-disable-next-line
      if(req.user._id != card.owner){
        return Promise.reject(new Error('notEnoughRights'));
      // eslint-disable-next-line
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
        const newErr = new Error('У вас недостаточно прав');
        newErr.statusCode = 403;
        next(newErr);
      } else if (err.name === 'CastError') {
        throw new BadReqErr('Переданы некорректные данные');
      } else if (err.message === 'notFound') {
        throw new NotFoundErr('Карточка не найдена');
      }
    })
    .catch(next);
};
