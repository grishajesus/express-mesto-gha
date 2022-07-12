/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const NotFoundError = require('./utils/NotFoundError');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');
const { validateCreateUser, validateLogin } = require('./middlewares/validators');

const app = express();

mongoose
  .connect('mongodb://0.0.0.0:27017/mestodb')
  .then(() => {
    console.log('Соединение с БД установлено');
  })
  .catch((err) => {
    console.log('Ошибка соединения с БД:', err.message);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(authMiddleware);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('*', (_, __, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());
app.use(errorMiddleware);

app.listen(3000);
