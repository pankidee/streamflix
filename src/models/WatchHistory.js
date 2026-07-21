const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WatchHistory = sequelize.define('WatchHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: DataTypes.UUID,
  movieId: DataTypes.UUID,
  progressSeconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = WatchHistory;