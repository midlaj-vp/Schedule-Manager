import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

const StrictProtectedRoute = ({ children }) => {
  const { username } = useParams();
  const token = localStorage.getItem('token');
  const loggedInUser = localStorage.getItem('user');
  if (!token) {
    return <Navigate to="/login" />;
  }



  if (loggedInUser !== username) {
    alert("You are not authorized to access this page!");
    return <Navigate to={`/${loggedInUser}/dashboard`} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/:username/dashboard"
          element={
            <StrictProtectedRoute>
              <Dashboard />
            </StrictProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;