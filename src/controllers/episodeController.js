const fs = require('fs');
const { Episode } = require('../models');
const { convertToHLS } = require('../services/transcodeService');
const { uploadDirectoryToR2 } = require('../services/r2Service');

exports.addEpisode = async (req, res) => {
  const rawFilePath = req.file?.path;
  try {
    const { seriesId, seasonNumber, episodeNumber, title, durationMinutes } = req.body;
    if (!rawFilePath) return res.status(400).json({ message: 'No video file uploaded' });

    const episode = await Episode.create({ seriesId, seasonNumber, episodeNumber, title, durationMinutes });

    const localOutputDir = await convertToHLS(rawFilePath, `episode-${episode.id}`);
    const remotePrefix = `episodes/${episode.id}`;
    const urlMap = await uploadDirectoryToR2(localOutputDir, remotePrefix);

    const playlistUrl = urlMap['playlist.m3u8'];
    if (!playlistUrl) throw new Error('Playlist upload to R2 failed');

    episode.videoPlaylistUrl = playlistUrl;
    await episode.save();

    fs.rmSync(localOutputDir, { recursive: true, force: true });
    fs.unlinkSync(rawFilePath);

    res.status(201).json(episode);
  } catch (err) {
    if (rawFilePath && fs.existsSync(rawFilePath)) fs.unlinkSync(rawFilePath);
    res.status(500).json({ message: err.message });
  }
};

exports.getEpisodeStream = async (req, res) => {
  try {
    const episode = await Episode.findByPk(req.params.id);
    if (!episode || !episode.videoPlaylistUrl) {
      return res.status(404).json({ message: 'Episode not found or has no video' });
    }
    res.json({ streamUrl: episode.videoPlaylistUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findByPk(req.params.id);
    if (!episode) return res.status(404).json({ message: 'Episode not found' });
    await episode.destroy();
    res.json({ message: 'Episode deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};