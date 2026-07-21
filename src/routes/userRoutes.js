const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/history', authMiddleware, userController.getWatchHistory);
router.delete('/history/:movieId', authMiddleware, userController.clearHistoryItem);

module.exports = router;