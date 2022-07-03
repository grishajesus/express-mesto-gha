const mongoose = require('mongoose');

const Card = require('../models/card');

const prepareCardResponse = (card) => ({
  _id: card._id,
  name: card.name,
  link: card.link,
  owner: card.owner,
  likes: card.likes,
  createdAt: card.createdAt,
});

const getCards = async (_, res) => {
  try {
    const cards = await Card.find({});

    const preparedCards = cards.map(prepareCardResponse);

    return res.send(preparedCards);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).send({ message: 'Неверный формат id карточки' });
    }

    const card = await Card.findById(cardId).orFail(
      () => new Error(`Карточка с таким _id ${cardId} не найдена`),
    );

    return res.send(prepareCardResponse(card));
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: req.user._id });

    return res.send(prepareCardResponse(card));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: error.message });
    }

    return res.status(500).send({ message: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).send({ message: 'Неверный id карточки' });
    }

    const card = await Card.findById(cardId).orFail(
      () => new Error(`Карточка с _id ${cardId} не найдена`),
    );

    if (card.owner.toString() !== req.user._id) {
      return res
        .status(403)
        .send({ message: 'Вы не можете удалить чужие карточки' });
    }

    const deletedCard = await Card.findByIdAndDelete(card._id).orFail(
      () => new Error('Ошибка при удалении'),
    );

    return res.send({
      data: prepareCardResponse(deletedCard),
      message: 'Карточка успешно удалена',
    });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).send({ message: 'Неверный формат id карточки' });
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error(`Карточка с _id ${cardId} не найдена`));

    return res.send({
      data: prepareCardResponse(card),
      message: 'Лайк успешно поставлен',
    });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

const unlikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).send({ message: 'Неверный формат id карточки' });
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error(`Карточка с _id ${cardId} не найдена`));

    return res.send({
      data: prepareCardResponse(card),
      message: 'Лайк успешно удален',
    });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

module.exports = {
  getCard,
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
