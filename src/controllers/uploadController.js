const fs = require('fs');
const path = require('path');
const { Movie } = require('../models');
const { convertToHLS } = require('../services/transcodeService');
const { uploadDirectoryToR2 } = require('../services/r2Service');

exports.uploadMovie = async (req, res) => {
  const rawFilePath = req.file?.path;

  try {
    const { title, description, posterUrl, genre, durationMinutes, releaseYear, vj } = req.body;

    if (!rawFilePath) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const movie = await Movie.create({
      title, description, posterUrl, genre, durationMinutes, releaseYear, vj,
    });

    const localOutputDir = await convertToHLS(rawFilePath, movie.id);

    const uploadedFiles = fs.readdirSync(localOutputDir);
    const remotePrefix = `movies/${movie.id}`;
    const urlMap = await uploadDirectoryToR2(localOutputDir, remotePrefix);

    const playlistUrl = urlMap['playlist.m3u8'];
    if (!playlistUrl) {
      throw new Error('Playlist upload to R2 failed');
    }

    movie.videoPlaylistUrl = playlistUrl;
    await movie.save();

    fs.rmSync(localOutputDir, { recursive: true, force: true });
    fs.unlinkSync(rawFilePath);

    res.status(201).json(movie);
  } catch (err) {
    if (rawFilePath && fs.existsSync(rawFilePath)) fs.unlinkSync(rawFilePath);
    res.status(500).json({ message: err.message });
  }
};