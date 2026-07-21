const { Movie, WatchHistory } = require('../models');

function toAbsoluteUrl(req, url) {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  const base = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}${url}`;
}

exports.getStreamUrl = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    if (!movie.videoPlaylistUrl) {
      return res.status(422).json({ message: 'This movie has no video attached yet' });
    }

    const history = await WatchHistory.findOne({
      where: { userId: req.userId, movieId: movie.id },
    });

    res.json({
      streamUrl: toAbsoluteUrl(req, movie.videoPlaylistUrl),
      resumeAtSeconds: history ? history.progressSeconds : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveProgress = async (req, res) => {
  try {
    const { progressSeconds } = req.body;

    const [history] = await WatchHistory.findOrCreate({
      where: { userId: req.userId, movieId: req.params.id },
      defaults: { progressSeconds: progressSeconds || 0 },
    });

    if (history.progressSeconds !== progressSeconds) {
      history.progressSeconds = progressSeconds;
      await history.save();
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};