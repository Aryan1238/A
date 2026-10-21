/**
 * PrepPilot - Server Entry Point
 * Initializes MongoDB connection and starts the HTTP server.
 * Includes intelligent background reconnection retry loop.
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

  // Background reconnect loop if initial connection was refused during DNS/IP propagation
  if (!dbConnection && mongoose.connection.readyState !== 1) {
    const retryInterval = setInterval(async () => {
      if (mongoose.connection.readyState === 1) {
        clearInterval(retryInterval);
        return;
      }
      try {
        console.log('🔄 [MongoDB Reconnect]: Retrying connection to Atlas cluster...');
        await connectDB();
        console.log('✅ [MongoDB Reconnect]: Successfully connected to Atlas!');
        clearInterval(retryInterval);
      } catch (retryErr) {
        console.warn('⚠️ [MongoDB Reconnect]: Still waiting for database access...', retryErr.message);
      }
    }, 5000);
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
