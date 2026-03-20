import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout }      = useAuth();
  const location              = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const closeMenu = () => setIsOpen(false);
  const isActive  = (path) => location.pathname === path ? 'active' : '';

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          ResilientRider
        </Link>

        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/how-it-works" className={isActive('/how-it-works')}>How It Works</Link></li>
            <li><Link to="/ai-technology" className={isActive('/ai-technology')}>AI Technology</Link></li>
            <li><Link to="/benefits" className={isActive('/benefits')}>Benefits</Link></li>
            {user && (
              <li><Link to={dashboardPath} className={isActive(dashboardPath)}>Dashboard</Link></li>
            )}
            <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
          </ul>

          <div className="navbar-buttons">
            <DarkModeToggle />
            {user ? (
              <>
                <span className="navbar-user">👤 {user.name?.split(' ')[0]}</span>
                <button className="btn btn-outline" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
