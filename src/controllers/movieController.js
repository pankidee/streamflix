const { Op } = require('sequelize');
const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
  try {
    const where = {};
    if (req.query.vj) where.vj = req.query.vj;
    const movies = await Movie.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedMovie = async (req, res) => {
  try {
    const where = {};
    if (req.query.vj) where.vj = req.query.vj;
    const movie = await Movie.findOne({ where, order: [['createdAt', 'DESC']] });
    res.json(movie || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVJList = async (req, res) => {
  res.json(Movie.VJ_OPTIONS);
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const movies = await Movie.findAll({ where: { title: { [Op.iLike]: `%${q}%` } } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    await movie.update(req.body);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    await movie.destroy();
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};