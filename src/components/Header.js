import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../pages/assets/styles/Header.css';

const Header = ({ toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab
  const isFragmentsActive = location.pathname === '/' || location.pathname.includes('/fragment');
  const isTagsActive = location.pathname === '/tags';
  
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">
          <Link to="/">Code Wallet</Link>
        </h1>
        <nav className="main-nav">
          <ul>
            <li className={isFragmentsActive ? 'active' : ''}>
              <Link to="/">Fragments</Link>
            </li>
            <li className={isTagsActive ? 'active' : ''}>
              <Link to="/tags">Tags</Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="header-right">
        {/* Dark Mode Toggle */}
        <button 
          className={`dark-mode-toggle ${darkMode ? 'active' : ''}`} 
          onClick={toggleDarkMode}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        {/* New Fragment Button (if on Fragments page) */}
        {isFragmentsActive && (
          <button 
            className="new-button"
            onClick={() => navigate('/fragment/new')}
          >
            New
          </button>
        )}
        
        {/* New Tag Button (if on Tags page) */}
        {isTagsActive && (
          <button 
            className="new-button"
            onClick={() => {
              // Open tag creation modal - to be implemented
              // You can replace this with your modal implementation
              alert('Create new tag functionality will be implemented here');
            }}
          >
            New
          </button>
        )}
        
        {/* Info Button */}
        <Link to="/info" className="info-button">
          Info
        </Link>
      </div>
    </header>
  );
};

export default Header;