import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCsrfToken, decodeToken, API_BASE_URL } from './../../utils/api';
import '../Auth.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      //hämta csrf token
      const csrfToken = await getCsrfToken();

      //Login
      const response = await fetch(
        'https://chatify-api.up.railway.app/auth/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({
            ...formData,
            csrfToken: csrfToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === 'Invalid credentials') {
          setError('Fel användarnamn eller lösenord. Försök igen.');
        } else {
          setError(data.message || 'Något gick fel vid inloggning');
        }
        setLoading(false);
        return;
      }

      //Decodear token för att få user info
      const decodedToken = decodeToken(data.token);

      const userData = {
        token: data.token,
        userId: decodedToken.id,
        username: decodedToken.user,
        avatar: decodedToken.avatar || 'https://i.pravatar.cc/200',
      };

      onLogin(userData);
      navigate('/chat');
    } catch (err) {
      setError('Kunde inte ansluta till servern. Försök igen.');
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1>Logga in</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Användarnamn</label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Lösenord</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className='error-message'>{error}</div>}
          <button type='submit' disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
        <p className='auth-link'>
          Inget konto? <Link to='/register'>Registrera här</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
