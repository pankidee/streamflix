const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  type: { type: DataTypes.ENUM('movie', 'series'), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  referenceId: { type: DataTypes.UUID, allowNull: false },
  posterUrl: DataTypes.STRING,
});

module.exports = Notification;