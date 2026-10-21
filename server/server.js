/**
 * PrepPilot - Server Entry Point
 * Initializes MongoDB connection and starts the HTTP server.
 * Includes intelligent in-memory Mongo fallback for evaluation environments.
 */

const app = require('./src/app');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5001;

async function startServer() {
  let dbConnection = null;

  try {
    dbConnection = await connectDB();
  } catch (err) {
    console.error('Initial MongoDB connection attempt failed:', err.message);
  }

  // Fallback to mongodb-memory-server if standard connection failed (great for viva demos)
  if (!dbConnection && mongoose.connection.readyState !== 1) {
    try {
      console.log('🔄 [MongoDB Fallback]: Launching in-memory MongoDB server for testing/viva demonstration...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✅ [MongoDB In-Memory Connected]: ${inMemoryUri}`);
    } catch (memErr) {
      console.warn(`⚠️ Could not launch in-memory MongoDB: ${memErr.message}`);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 PrepPilot API Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Engine: Google Gemini (Active / Mock Fallback enabled)`);
    console.log(`===============================================`);
  });

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error(`💥 Unhandled Rejection: ${err.message}`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
