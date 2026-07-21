const { Movie, WatchHistory } = require('../models');

exports.getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.findAll({
      where: { userId: req.userId },
      include: [{ model: Movie }],
      order: [['updatedAt', 'DESC']],
    });

    const results = history
      .filter((h) => h.Movie) // guard against orphaned rows if a movie was deleted
      .map((h) => ({
        ...h.Movie.toJSON(),
        progressSeconds: h.progressSeconds,
        watchedAt: h.updatedAt,
      }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearHistoryItem = async (req, res) => {
  try {
    await WatchHistory.destroy({
      where: { userId: req.userId, movieId: req.params.movieId },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};