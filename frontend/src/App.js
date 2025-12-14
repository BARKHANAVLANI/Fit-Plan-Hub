import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrainerDashboard from './pages/TrainerDashboard';
import PlanDetails from './pages/PlanDetails';
import UserFeed from './pages/UserFeed';
import TrainerProfile from './pages/TrainerProfile';
import MySubscriptions from './pages/MySubscriptions';
import FollowedTrainers from './pages/FollowedTrainers';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/trainer/dashboard"
              element={
                <PrivateRoute>
                  <TrainerDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/plans/:id" element={<PlanDetails />} />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <UserFeed />
                </PrivateRoute>
              }
            />
            <Route
              path="/followed-trainers"
              element={
                <PrivateRoute>
                  <FollowedTrainers />
                </PrivateRoute>
              }
            />
            <Route path="/trainers/:id" element={<TrainerProfile />} />
            <Route
              path="/subscriptions"
              element={
                <PrivateRoute>
                  <MySubscriptions />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

