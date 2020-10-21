const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadReqErr = require('../errors/BadReqErr');
const NotFoundErr = require('../errors/NotFoundErr');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET = 'dev-key' } = process.env;

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err) {
        throw new NotFoundErr('Такого пользователя не существует');
      }
    })
    .catch(next);
};

// eslint-disable-next-line
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!password) {
    throw new BadReqErr('Переданы некорректные данные');
  }
  User.init().then(() => {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => User.findById(user._id))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadReqErr('Переданы некорректные данные');
        } else if (err.name === 'MongoError') {
          const newErr = new Error('Этот email уже занят');
          newErr.statusCode = 409;
          next(newErr);
        }
      })
      .catch(next);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 900000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};
