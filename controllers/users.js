const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../utils/NotFoundError');
const ConflictError = require('../utils/ConflictError');
const BadRequestError = require('../utils/BadRequestError');
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

    const user = await User.findById(userId).orFail(
      () => new NotFoundError(`Пользователь с таким _id ${userId} не найден`),
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
    if (error.code === 11000) {
      return next(new ConflictError(error.message));
    }

    if (error.name === 'ValidationError') {
      return next(new BadRequestError(error.message));
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
      return next(new BadRequestError(error.message));
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
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, 'smth-secret-key', { expiresIn: '7d' });

    return res.send({ token });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).orFail(
      () => new NotFoundError(`Пользователь с таким _id ${_id} не найден`),
    );

    return res.send(user);
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
