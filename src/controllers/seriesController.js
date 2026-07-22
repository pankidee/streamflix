const { Series, Episode } = require('../models');

exports.getAllSeries = async (req, res) => {
  try {
    const where = {};
    if (req.query.vj) where.vj = req.query.vj;

    if (req.query.all === 'true') {
      const series = await Series.findAll({ where, order: [['createdAt', 'DESC']] });
      return res.json(series);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Series.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      series: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSeriesById = async (req, res) => {
  try {
    const series = await Series.findByPk(req.params.id, {
      include: [{ model: Episode }],
    });
    if (!series) return res.status(404).json({ message: 'Series not found' });
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSeries = async (req, res) => {
  try {
    const series = await Series.create(req.body);
    res.status(201).json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSeries = async (req, res) => {
  try {
    const series = await Series.findByPk(req.params.id);
    if (!series) return res.status(404).json({ message: 'Series not found' });
    await series.update(req.body);
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const series = await Series.findByPk(req.params.id);
    if (!series) return res.status(404).json({ message: 'Series not found' });
    await series.destroy();
    res.json({ message: 'Series deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};