const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  // Try to copy from .env.example if it exists
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env from .env.example');
  } else {
    // Create default .env
    const defaultEnv = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_${Date.now()}
NODE_ENV=development
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Created default .env file');
  }
  
  console.log('\n⚠️  Please update JWT_SECRET in .env file for production!');
  console.log('⚠️  Update MONGODB_URI if using MongoDB Atlas\n');
} else {
  console.log('✅ .env file already exists');
}

// Validate .env content
require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change_this')) {
  console.log('⚠️  Warning: JWT_SECRET should be changed from default value');
}

if (!process.env.MONGODB_URI) {
  console.log('⚠️  Warning: MONGODB_URI is not set');
}

console.log('\n✅ Environment setup complete!');

