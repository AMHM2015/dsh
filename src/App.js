import React, { useState } from 'react';
import './App.css';
import { database } from './firebase';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import bcrypt from 'bcryptjs';
import LidarData from './components/LidarData';
import LocationMap from './components/LocationMap';
import JoystickControl from './components/JoystickControl';
import DefectDetection from './components/DefectDetection';
import CameraFeed from './components/CameraFeed';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  React.useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const usersRef = ref(database, 'users');
      const userQuery = query(usersRef, orderByChild('username'), equalTo(userData.username));
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        setError('Username already exists');
        return;
      }

      const hashedPassword = await hashPassword(userData.password);
      const newUserRef = ref(database, `users/${userData.username}`);
      await set(newUserRef, {
        username: userData.username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      alert('Registration successful! Please login');
      setIsRegistering(false);
      setUserData({ username: '', password: '' });
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userRef = ref(database, `users/${userData.username}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        setError('Invalid credentials');
        return;
      }

      const userDataDB = snapshot.val();
      const isValid = await bcrypt.compare(userData.password, userDataDB.password);

      if (isValid) {
        localStorage.setItem('loggedInUser', userData.username);
        setIsLoggedIn(true);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <div className="auth-container">
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={userData.username}
              onChange={(e) => setUserData({...userData, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({...userData, password: e.target.value})}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
          <button 
            className="toggle-mode"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      ) : (
        <div className="dashboard">
          <div className="card sensor-data">
            <LidarData />
          </div>
          <div className="card road-status">
            <LocationMap />
          </div>
          <div className="card vehicle-controls">
            <JoystickControl />
          </div>
          <div className="card navigation-status">
            <DefectDetection />
          </div>
          <div className="card live-camera-feed">
            <CameraFeed />
          </div>
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;