import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [headerHidden, setHeaderHidden] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    setHeaderHidden(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isScrollingDown = currentScroll > lastScrollY.current;
      const delta = Math.abs(currentScroll - lastScrollY.current);

      if (delta < 10) {
        return;
      }

      if (currentScroll <= 90) {
        setHeaderHidden(false);
      } else {
        setHeaderHidden(isScrollingDown);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
      return;
    }

    navigate('/login');
  };

  const showHeader = () => setHeaderHidden(false);

  return (
    <>
      <div className="app-header-hover-zone" onMouseEnter={showHeader} />
      <header className={`app-header ${headerHidden ? 'header-hidden' : ''}`}>
        <div className="brand">
          <div className="brand-mark">♪</div>
          <div>
            <p className="brand-subtitle">Music Review</p>
            <h1 className="brand-title">SoundBoard</h1>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/review">Reseñas</Link>
          <Link to="/recomendaciones">Recomendaciones</Link>
          <Link to="/profile">Perfil</Link>
          <button className="auth-button" type="button" onClick={handleAuthAction}>
            {isAuthenticated ? 'Cerrar sesión' : 'Iniciar sesión'}
          </button>
        </nav>
      </header>
    </>
  );
}

export default Header;
