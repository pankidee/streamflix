const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Movie = require('./Movie');

const Series = sequelize.define('Series', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  posterUrl: DataTypes.STRING,
  genre: DataTypes.STRING,
  releaseYear: DataTypes.INTEGER,
  vj: { type: DataTypes.ENUM(...Movie.VJ_OPTIONS), allowNull: true },
});

module.exports = Series;