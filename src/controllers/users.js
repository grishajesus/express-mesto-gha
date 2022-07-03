const mongoose = require('mongoose');

const User = require('../models/user');

const prepareUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

const getUsers = async (_, res) => {
  try {
    const users = await User.find({});

    return res.send({ data: users });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ message: 'Неверный формат id пользователя' });
    }

    const user = await User.findById(userId).orFail(
      () => new Error(`Пользователь с таким _id ${userId} не найден`),
    );

    return res.send(prepareUserResponse(user));
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });

    return res.send(prepareUserResponse(user));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    return res.send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    return res.send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
