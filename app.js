require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundErr = require('./errors/NotFoundErr');

const { PORT = 3000 } = process.env;
const app = express();
const getUser = require('./routes/users');
const getCard = require('./routes/cards');
const login = require('./routes/users');
const createUser = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/users', getUser);
app.use('/cards', getCard);
app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
