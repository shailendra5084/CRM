require('dotenv').config();

const envVar = process.env;

module.exports = {
  port: envVar.PORT || 3000,
  jwt: {
    secretKey: envVar.JWT_SECRET_KEY
    // expiresIn: '7d'
  },
  mongo: {
    uri: envVar.MONGO_URL 
  },
  push: {
    key: process.env.SERVER_KEY,
    url: process.env.SERVER_URL
  }
  
};