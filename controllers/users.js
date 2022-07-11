const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/ApiError');
const User = require('../models/user');

const prepareUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

const getUsers = async (_, res, next) => {
  try {
    const users = await User.find({});

    return res.send({ data: users });
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError({ statusCode: 400, message: 'Неверный формат id пользователя' });
    }

    const user = await User.findById(userId).orFail(
      () => new ApiError({ statusCode: 404, message: `Пользователь с таким _id ${userId} не найден` }),
    );

    return res.send(prepareUserResponse(user));
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: passwordHash,
    });

    return res.send(prepareUserResponse(user));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ApiError({ statusCode: 400, message: error.message }));
    } if (error.code === 11000) {
      return next(new ApiError({ statusCode: 409, message: error.message }));
    }

    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ApiError({ statusCode: 400, message: error.message }));
    }

    return next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );

    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ApiError({ statusCode: 400, message: error.message }));
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, 'smth-secret-key', { expiresIn: '7d' });

    res.cookie('authToken', token, { maxAge: 3600 * 24 * 7, httpOnly: true });

    return res.send({ token });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).orFail(
      () => new ApiError({ statusCode: 404, message: `Пользователь с таким _id ${_id} не найден` }),
    );

    return res.send(prepareUserResponse(user));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
