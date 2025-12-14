# Fix Common Errors - Step by Step Guide

## Quick Diagnostic

### Backend Errors - Common Fixes

#### 1. "JWT_SECRET is not set" Error
**Solution:**
```bash
cd backend
# Create .env file manually or run:
node setup-env.js
```

Make sure `.env` file contains:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
NODE_ENV=development
```

#### 2. "MongoDB connection error"
**Solutions:**
- **Local MongoDB:** Make sure MongoDB is running
  ```bash
  # Check if MongoDB is running
  # Windows: Check Services for MongoDB
  # Or start manually if installed
  ```
  
- **MongoDB Atlas:** Update `.env` with your connection string:
  ```env
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitplanhub
  ```

#### 3. "Cannot find module" Error
**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules
npm install
```

#### 4. "Port already in use"
**Solution:**
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000:
  ```powershell
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  ```

### Frontend Errors - Common Fixes

#### 1. "Cannot find module" or Import Errors
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules
npm install
```

#### 2. "Module not found: Can't resolve" Errors
**Check:**
- All files exist in `frontend/src/pages/`
- All files exist in `frontend/src/components/`
- Import paths are correct

#### 3. "Proxy error" or "Network Error"
**Solution:**
- Make sure backend is running on port 5000
- Check `frontend/package.json` has: `"proxy": "http://localhost:5000"`
- Restart frontend after backend is running

#### 4. React Scripts Errors
**Solution:**
```bash
cd frontend
npm install react-scripts@5.0.1 --save
npm start
```

## Step-by-Step Fix Process

### Step 1: Fix Backend

```bash
# Navigate to backend
cd backend

# Check if .env exists
# If not, create it with the content above

# Reinstall dependencies
npm install

# Try starting
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB
✅ Server running on port 5000
✅ API available at http://localhost:5000/api
```

### Step 2: Fix Frontend

```bash
# Navigate to frontend (in a NEW terminal)
cd frontend

# Reinstall dependencies
npm install

# Start frontend
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view fitplanhub-frontend in the browser.
  Local:            http://localhost:3000
```

## Complete Reset (If Nothing Works)

### Backend Reset:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
# Create .env file (see content above)
npm run dev
```

### Frontend Reset:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## Still Having Issues?

**Please share:**
1. The exact error message from backend terminal
2. The exact error message from frontend terminal
3. Which step you're on (backend or frontend)

This will help me provide a specific fix!

