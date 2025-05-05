import React, { useState, useEffect ,useContext} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';



function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = storedTheme;
    return storedTheme;
  });
  const githubRepoURL = 'YOUR_GITHUB_REPOSITORY_URL';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-brand">Loan Calculator</div>
      <button className="navbar-toggle" onClick={toggleMobileMenu}>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
      <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exchange-rates" className="nav-link">
              Exchange Rates (Live)
            </Link>
          </li>
          <li className="nav-item">
            <a href={githubRepoURL} className="nav-link" target="_blank" rel="noopener noreferrer">
              About
            </a>
          </li>
          <li className="nav-item">
            <Link to="/error" className="nav-link">
              Error Page
            </Link>
          </li>
        </ul>
        <div className="navbar-toggle-switch">
          <label className="theme-switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;