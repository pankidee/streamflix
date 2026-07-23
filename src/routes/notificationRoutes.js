const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getRecent } = require('../controllers/notificationController');

router.get('/', authMiddleware, getRecent);

module.exports = router;