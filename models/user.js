const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const ApiError = require('../utils/ApiError');
const { LINK_REGEX } = require('../utils/constants');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => LINK_REGEX.test(value),
      message: 'Некорректная ссылка.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Некорректный email.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new ApiError({ statusCode: 401, message: 'Неправильные почта или пароль' }));
    }

    return bcrypt.compare(password, user.password).then((isEqualPassword) => {
      if (!isEqualPassword) {
        return Promise.reject(new ApiError({ statusCode: 401, message: 'Неправильные почта или пароль' }));
      }

      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
