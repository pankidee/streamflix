const User = require('./User');
const Movie = require('./Movie');
const WatchHistory = require('./WatchHistory');

User.hasMany(WatchHistory, { foreignKey: 'userId' });
WatchHistory.belongsTo(User, { foreignKey: 'userId' });

Movie.hasMany(WatchHistory, { foreignKey: 'movieId' });
WatchHistory.belongsTo(Movie, { foreignKey: 'movieId' });

module.exports = { User, Movie, WatchHistory };