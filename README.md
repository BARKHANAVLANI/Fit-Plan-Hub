# FitPlanHub 🏋️‍♂️

A full-stack fitness platform where certified trainers create and manage paid fitness plans, and users can browse, follow trainers, purchase plans, and access subscribed content.

## Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Role-based access control (User/Trainer)
- ✅ Protected routes with middleware

### Trainer Capabilities
- ✅ Create, update, and delete fitness plans
- ✅ View all plans they created
- ✅ Manage plan content and pricing

### User Capabilities
- ✅ Browse all available fitness plans (preview mode)
- ✅ Subscribe/purchase plans (simulated payment)
- ✅ Access full plan details after subscription
- ✅ Follow/unfollow trainers
- ✅ View personalized feed from followed trainers
- ✅ View all purchased plans

### Access Control
- ✅ Non-subscribed users see: title, trainer name, price
- ✅ Subscribed users see: full plan details
- ✅ Backend enforces access rules (not frontend-only)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- Modern CSS with custom properties

## Project Structure

```
FitPlanHub/
├── backend/
│   ├── models/          # MongoDB models (User, Plan, Subscription, Follow)
│   ├── routes/          # API routes (auth, plans, subscriptions, follow, feed, trainers)
│   ├── middleware/      # Authentication middleware
│   ├── utils/           # Utility functions (JWT)
│   ├── scripts/         # Seed script
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, PrivateRoute)
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# Make sure MongoDB is running on your system
```

5. (Optional) Seed the database with sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user/trainer
- `POST /api/auth/login` - Login user/trainer
- `GET /api/auth/me` - Get current user (protected)

### Plans
- `GET /api/plans` - Get all plans (public)
- `GET /api/plans/:id` - Get plan by ID (protected, full details if subscribed)
- `POST /api/plans` - Create plan (trainer only)
- `PUT /api/plans/:id` - Update plan (trainer only, own plans)
- `DELETE /api/plans/:id` - Delete plan (trainer only, own plans)
- `GET /api/plans/trainer/my-plans` - Get trainer's plans (trainer only)

### Subscriptions
- `POST /api/subscriptions` - Subscribe to a plan (user only)
- `GET /api/subscriptions` - Get user's subscriptions (user only)
- `GET /api/subscriptions/:planId` - Check subscription status

### Follow
- `POST /api/follow/:trainerId` - Follow a trainer (user only)
- `DELETE /api/follow/:trainerId` - Unfollow a trainer (user only)
- `GET /api/follow` - Get followed trainers (user only)
- `GET /api/follow/:trainerId` - Check follow status

### Feed
- `GET /api/feed` - Get personalized feed (user only)

### Trainers
- `GET /api/trainers` - Get all trainers (public)
- `GET /api/trainers/:id` - Get trainer profile (public)

## Sample Accounts (After Seeding)

### Trainers
- Email: `john@trainer.com` / Password: `password123`
- Email: `sarah@trainer.com` / Password: `password123`
- Email: `mike@trainer.com` / Password: `password123`

### Users
- Email: `alice@user.com` / Password: `password123`
- Email: `bob@user.com` / Password: `password123`

## Key Features Implementation

### Role-Based Access Control
- Middleware checks user role before allowing access
- Trainers can only access trainer routes
- Users can only access user routes

### Subscription System
- Simulated payment (always succeeds)
- Prevents duplicate subscriptions
- Subscription expiration based on plan duration
- Backend enforces content access

### Follow System
- Users can follow/unfollow trainers
- Prevents duplicate follows
- Prevents self-following

### Personalized Feed
- Shows plans from followed trainers only
- Indicates which plans user has purchased
- Sorted by newest first

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration

## Development Notes

- The application uses a proxy in `package.json` to forward API requests from frontend to backend
- JWT tokens are stored in localStorage
- All sensitive operations are protected by authentication middleware
- Content access is enforced on the backend, not just the frontend

## Future Enhancements

- Real payment gateway integration
- Email notifications
- Plan reviews and ratings
- Progress tracking
- Video content support
- Mobile app
- Admin dashboard

## License

ISC

## Author

Built with ❤️ for fitness enthusiasts

