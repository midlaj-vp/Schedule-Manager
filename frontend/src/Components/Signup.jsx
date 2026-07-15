import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

function Signup() { 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Cannot connect to backend server!');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSignup} className="login-form">
        <h2>Create Account</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg" style={{ color: 'green', background: '#FFF4E8', padding: '8px', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }}>{success}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose username"
            required
          />
        </div>

        <div className="form-group">
          <label>Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
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
              className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                }`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>

        <button type="submit" className="login-btn">Sign Up</button>
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color: ' #e38237', cursor: 'pointer', fontWeight: 'bold' }}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;