import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCsrfToken, API_BASE_URL } from '../../utils/api';
import '../Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    avatar: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(
        'https://chatify-api.up.railway.app/auth/register',
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
        if (data.message === 'Username or email already exists') {
          setError(
            'Användarnamnet eller e-postadressen finns redan. Välj ett annat.'
          );
        } else {
          setError(data.message || 'Något gick fel vid registrering');
        }
        setLoading(false);
        return;
      }

      setSuccess('Registrering lyckades! Omdirigerar till inloggning...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Kunde inte ansluta till servern. Försök igen.');
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1>Registrera konto</h1>
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
            <label>E-post</label>
            <input
              type='email'
              name='email'
              value={formData.email}
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
          <div className='form-group'>
            <label>Avatar URL (valfritt)</label>
            <input
              type='text'
              name='avatar'
              value={formData.avatar}
              onChange={handleChange}
              placeholder='https://i.pravatar.cc/200'
            />
          </div>
          {error && <div className='error-message'>{error}</div>}
          {success && <div className='success-message'>{success}</div>}
          <button type='submit' disabled={loading}>
            {loading ? 'Registrerar...' : 'Registrera'}
          </button>
        </form>
        <p className='auth-link'>
          Har du redan ett konto? <Link to='/login'>Logga in här</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
