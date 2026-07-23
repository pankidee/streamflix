const User = require('./User');
const Movie = require('./Movie');
const WatchHistory = require('./WatchHistory');

User.hasMany(WatchHistory, { foreignKey: 'userId' });
WatchHistory.belongsTo(User, { foreignKey: 'userId' });

Movie.hasMany(WatchHistory, { foreignKey: 'movieId' });
WatchHistory.belongsTo(Movie, { foreignKey: 'movieId' });

const Series = require('./Series');
const Episode = require('./Episode');

const Notification = require('./Notification');
module.exports.Notification = Notification;

Series.hasMany(Episode, { foreignKey: 'seriesId', onDelete: 'CASCADE' });
Episode.belongsTo(Series, { foreignKey: 'seriesId' });

module.exports.Series = Series;
module.exports.Episode = Episode;

module.exports = { User, Movie, WatchHistory };