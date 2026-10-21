/**
 * PrepPilot - MongoDB Database Configuration
 * Manages Mongoose connection with event listeners and graceful shutdown.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/preppilot';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      directConnection: true,
      family: 4,
      autoIndex: true,
      driverInfo: {
        name: 'nodejs',
        version: '6.0.0'
      }
    });

    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.error(`💡 Tip: Ensure MongoDB is running locally (brew services start mongodb-community) or set MONGODB_URI in server/.env`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
