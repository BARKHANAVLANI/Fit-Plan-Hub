const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set in .env file');
  console.error('Please create a .env file in the backend directory with:');
  console.error('JWT_SECRET=your_super_secret_jwt_key_change_this_in_production');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/follow', require('./routes/follow'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/trainers', require('./routes/trainers'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FitPlanHub API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitplanhub';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Make sure MongoDB is running');
    console.error('2. Check your MONGODB_URI in .env file');
    console.error('3. For local MongoDB, start it with: mongod');
    console.error('4. Or use MongoDB Atlas and update MONGODB_URI\n');
    process.exit(1);
  });

module.exports = app;

