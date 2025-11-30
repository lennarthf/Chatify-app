import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideNav.css';

function SideNav({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <button className='sidenav-toggle' onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`sidenav ${isOpen ? 'open' : ''}`}>
        <button className='sidenav-close' onClick={() => setIsOpen(false)}>
          ✕
        </button>

        <div className='sidenav-content'>
          <div className='sidenav-user'>
            <img
              src={user.avatar}
              alt={user.username}
              className='sidenav-avatar'
            />
            <h3>{user.username}</h3>
          </div>

          <button onClick={handleLogout} className='logout-btn'>
            Logga ut
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='sidenav-overlay' onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default SideNav;
