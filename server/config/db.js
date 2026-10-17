const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
      console.log('[DNS] Note on custom DNS servers:', err.message);
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cm_helphub';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] Connected successfully to MongoDB Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;