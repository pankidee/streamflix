const app = require('./src/app');
const sequelize = require('./src/config/db');
require('./src/models'); // loads all models + their relationships

const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
  
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
  });

