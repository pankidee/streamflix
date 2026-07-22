const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Episode = sequelize.define('Episode', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  seriesId: { type: DataTypes.UUID, allowNull: false },
  seasonNumber: { type: DataTypes.INTEGER, defaultValue: 1 },
  episodeNumber: { type: DataTypes.INTEGER, allowNull: false },
  title: DataTypes.STRING,
  videoPlaylistUrl: DataTypes.STRING,
  durationMinutes: DataTypes.INTEGER,
});

module.exports = Episode;