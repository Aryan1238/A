/**
 * PrepPilot - Test Environment Setup
 * Connects directly to local MongoDB preppilot_test database.
 * Provides fixed client metadata to bypass Jest VM BSON serialization issue with MongoDB 8.
 */

// Override makeClientMetadata so MongoDB 8 always receives a valid driver handshake from Jest
try {
  const clientMetadata = require('mongodb/lib/cmap/handshake/client_metadata');
  if (clientMetadata) {
    clientMetadata.makeClientMetadata = async function () {
      return {
        driver: { name: 'nodejs', version: '6.0.0' },
        os: { type: 'Darwin' },
        platform: 'Node.js'
      };
    };
  }
} catch (e) {
  console.warn('Could not override makeClientMetadata:', e.message);
}

const mongoose = require('mongoose');

jest.setTimeout(20000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_12345';

  const uri = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/preppilot_test';
  await mongoose.connect(uri, {
    directConnection: true,
    family: 4,
    serverSelectionTimeoutMS: 5000
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase();
    } catch (e) {}
    await mongoose.disconnect();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});
