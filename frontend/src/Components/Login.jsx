import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

function Login({ onToggleForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.username);

        setAlertInfo({ show: true, message: 'Login successful!', type: 'success' });
        
        
        setTimeout(() => {
          setAlertInfo({ show: false, message: '', type: '' });
          navigate(`/${data.username}/dashboard`);
        }, 2000);

      } else {
        setError(data.error || 'Something went wrong');
        setAlertInfo({ show: true, message: data.error || 'Invalid Credentials', type: 'error' });
        setTimeout(() => setAlertInfo({ show: false, message: '', type: '' }), 3000);
      }
    } catch (err) {
      setError('Could not connect to the backend server');
      setAlertInfo({ show: true, message: 'Could not connect to the backend server!', type: 'error' });
      setTimeout(() => setAlertInfo({ show: false, message: '', type: '' }), 3000);
    }
  };

  return (
    <div className="login-container">
      {alertInfo.show && (
        <div className={`custom-toast ${alertInfo.type}`}>
          <i className={alertInfo.type === 'success' ? "bi bi-check-circle-fill" : "bi bi-exclamation-triangle-fill"}></i>
          <span>{alertInfo.message}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <i
              className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>

        <button type="submit" className="login-btn">Login</button>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Don't have an account? <span
            onClick={() => navigate('/signup')}
            style={{
              color: '#e38237',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;