/**
 * PrepPilot - MongoDB Database Configuration
 * Manages Mongoose connection with event listeners and graceful shutdown.
 * Automatically sanitizes connection strings and disables directConnection for Atlas SRV clusters.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  let mongoUri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/preppilot').trim();

  // Strip wrapping quotes if entered in dashboard UI
  mongoUri = mongoUri.replace(/^["']|["']$/g, '').trim();

  // Validate scheme
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    const errorMsg =
      `Invalid scheme in MONGODB_URI ("${mongoUri}"). ` +
      `Connection string must start with "mongodb://" or "mongodb+srv://". ` +
      `Please set your real MongoDB Atlas connection string in Render Environment Variables.`;
    console.error(`❌ [MongoDB Connection Error]: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const isSrv = mongoUri.startsWith('mongodb+srv://');
  const options = {
    serverSelectionTimeoutMS: 10000,
    autoIndex: true
  };

  // directConnection is strictly for standalone local MongoDB instances; breaks Atlas SRV
  if (!isSrv) {
    options.directConnection = true;
    options.family = 4;
  }

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.error(`💡 Tip: Ensure MongoDB Atlas cluster IP access list allows 0.0.0.0/0 (all IPs) and MONGODB_URI has correct username/password.`);
    throw error;
  }
};

module.exports = connectDB;
