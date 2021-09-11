
const connectDb = require('./config/mongo.config');
connectDb((db, client) => {
  module.exports = { db, client }
  const config = require('./config');
  const app = require('./config/express.config');
  app.listen(config.port, () => {
    console.log('server running on port ' + config.port);
  })
})