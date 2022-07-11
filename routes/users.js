const router = require('express').Router();

const { validateGetUserById, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validators');
const {
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateGetUserById, getUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
