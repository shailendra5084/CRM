
const { MongoClient } = require("mongodb");
const { uri } = require('./index').mongo
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });


async function connectDB(callback) {
  try {
    await client.connect();
    const database = client.db('mydb');
    await database.collection('users').createIndex( { "phoneNo": 1 }, { unique: true, sparse: true } )
    callback(database, client)
  } catch (err) {
    console.error(err)
    await client.close();
  }
}

module.exports = connectDB