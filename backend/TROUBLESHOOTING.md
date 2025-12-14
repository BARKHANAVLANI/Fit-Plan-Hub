# Backend Troubleshooting Guide

## Common Errors and Solutions

### 1. "Cannot find module" errors
**Error:** `Cannot find module 'express'` or similar
**Solution:**
```bash
cd backend
npm install
```

### 2. MongoDB Connection Error
**Error:** `MongoDB connection error: ...`
**Solutions:**
- Make sure MongoDB is running locally:
  ```bash
  # Windows (if installed as service, it should auto-start)
  # Or start manually:
  mongod
  ```
- Or use MongoDB Atlas (cloud):
  - Update `.env` with your Atlas connection string:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitplanhub
    ```

### 3. Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`
**Solutions:**
- Kill the process using port 5000:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- Or change PORT in `.env` file

### 4. Missing .env file
**Error:** `JWT_SECRET is undefined` or MongoDB connection fails
**Solution:**
```bash
cd backend
cp .env.example .env
# Edit .env and add:
# JWT_SECRET=your_secret_key_here
# MONGODB_URI=mongodb://localhost:27017/fitplanhub
```

### 5. "JWT_SECRET is required" error
**Solution:**
- Create `.env` file in backend directory
- Add: `JWT_SECRET=your_super_secret_jwt_key_change_this_in_production`

### 6. Module not found errors for routes
**Error:** `Cannot find module './routes/auth'`
**Solution:**
- Make sure all route files exist in `backend/routes/` directory
- Check file names match exactly (case-sensitive)

### 7. Syntax Errors
**Error:** `SyntaxError: Unexpected token` or similar
**Solution:**
- Check for missing commas, brackets, or quotes
- Verify all files are saved properly
- Run: `node --check server.js` to validate syntax

## Quick Diagnostic Commands

```bash
# Check if dependencies are installed
cd backend
npm list

# Check Node.js version (should be v14+)
node --version

# Test MongoDB connection
mongosh
# Then: use fitplanhub

# Validate server.js syntax
node --check server.js
```

## Still Having Issues?

1. Check the full error message in terminal
2. Verify `.env` file exists and has correct values
3. Ensure MongoDB is running
4. Try deleting `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

