const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VJ_OPTIONS = ['VJ Junior', 'VJ Emmy', 'VJ Ice P', 'VJ Jingo', 'VJ Kevo', 'VJ Ulio'];

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  posterUrl: DataTypes.STRING,
  videoPlaylistUrl: DataTypes.STRING,
  genre: DataTypes.STRING,
  durationMinutes: DataTypes.INTEGER,
  releaseYear: DataTypes.INTEGER,
  vj: {
    type: DataTypes.ENUM(...VJ_OPTIONS),
    allowNull: false,
  },
});

Movie.VJ_OPTIONS = VJ_OPTIONS;

module.exports = Movie;