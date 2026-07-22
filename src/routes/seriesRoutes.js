const router = require('express').Router();
const seriesController = require('../controllers/seriesController');
const episodeController = require('../controllers/episodeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, seriesController.getAllSeries);
router.get('/:id', authMiddleware, seriesController.getSeriesById);
router.post('/', authMiddleware, adminMiddleware, seriesController.createSeries);
router.put('/:id', authMiddleware, adminMiddleware, seriesController.updateSeries);
router.delete('/:id', authMiddleware, adminMiddleware, seriesController.deleteSeries);

router.post('/episodes/upload', authMiddleware, adminMiddleware, upload.single('video'), episodeController.addEpisode);
router.get('/episodes/:id/stream', authMiddleware, episodeController.getEpisodeStream);
router.delete('/episodes/:id', authMiddleware, adminMiddleware, episodeController.deleteEpisode);

module.exports = router;