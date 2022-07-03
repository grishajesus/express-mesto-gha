const router = require('express').Router();

const {
  getCard,
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', getCard);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

module.exports = router;
