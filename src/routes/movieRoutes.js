const router = require('express').Router();
const movieController = require('../controllers/movieController');
const streamController = require('../controllers/streamController');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/vjs', authMiddleware, movieController.getVJList);
router.get('/featured', authMiddleware, movieController.getFeaturedMovie);
router.get('/', authMiddleware, movieController.getAllMovies);
router.get('/search', authMiddleware, movieController.searchMovies);
router.get('/:id', authMiddleware, movieController.getMovieById);
router.get('/:id/stream', authMiddleware, streamController.getStreamUrl);
router.post('/:id/progress', authMiddleware, streamController.saveProgress);

router.post('/', authMiddleware, adminMiddleware, movieController.createMovie);
router.put('/:id', authMiddleware, adminMiddleware, movieController.updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, movieController.deleteMovie);

router.post(
  '/upload',
  authMiddleware, adminMiddleware,
  upload.single('video'),
  uploadController.uploadMovie
);

module.exports = router;