# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Quick Setup (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed  # Optional: Add sample data
npm run dev   # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start     # Starts on http://localhost:3000
```

## Test Accounts (After Seeding)

**Trainers:**
- john@trainer.com / password123
- sarah@trainer.com / password123

**Users:**
- alice@user.com / password123
- bob@user.com / password123

## Key Features to Test

1. **As a Trainer:**
   - Sign up as trainer
   - Create fitness plans
   - Edit/delete your plans
   - View your dashboard

2. **As a User:**
   - Sign up as user
   - Browse all plans
   - Follow trainers
   - Subscribe to plans
   - View personalized feed
   - Access subscribed content

## Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify .env file exists
- Check PORT is not in use

**Frontend won't connect:**
- Ensure backend is running on port 5000
- Check proxy in frontend/package.json

**Authentication issues:**
- Clear localStorage
- Check JWT_SECRET in backend .env
- Verify token in browser DevTools

