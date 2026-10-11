require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_1234567890';
const mongoose = require('mongoose');

let mongoServer;

const connect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Agar MONGO_URI maujood hai toh dedicated '_test' database use karo
  // Isse 712MB binary download karne ki zaroorat nahi padti aur tests foran chalte hain
  if (process.env.MONGO_URI) {
    let testUri = process.env.MONGO_URI;
    if (testUri.includes('/event_management?')) {
      testUri = testUri.replace('/event_management?', '/event_management_test?');
    } else if (testUri.includes('/event_management')) {
      testUri = testUri.replace('/event_management', '/event_management_test');
    }
    await mongoose.connect(testUri);
    return;
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = { connect, closeDatabase, clearDatabase };
