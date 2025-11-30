import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //kollar ifall man redan är inloggad
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const avatar = localStorage.getItem('avatar');

    if (token && userId && username) {
      setUser({ token, userId, username, avatar });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('avatar', userData.avatar || '');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
  };

  return (
    <Router>
      <Routes>
        <Route
          path='/register'
          element={!user ? <Register /> : <Navigate to='/chat' />}
        />
        <Route
          path='/login'
          element={
            !user ? <Login onLogin={handleLogin} /> : <Navigate to='/chat' />
          }
        />
        <Route
          path='/chat'
          element={
            user ? (
              <Chat user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route path='/' element={<Navigate to={user ? '/chat' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
