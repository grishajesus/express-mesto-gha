/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

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

app.use((req, _, next) => {
  req.user = {
    _id: '62c18b11f92ddc25333e121d',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(3000);
