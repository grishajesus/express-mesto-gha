const router = require('express').Router();

const { validateCreateCard, validateCardId } = require('../middlewares/validators');
const {
  getCard,
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.get('/:cardId', validateCardId, getCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, unlikeCard);

module.exports = router;
