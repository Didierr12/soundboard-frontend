import { useNavigate } from 'react-router-dom';
import './Titulo.css';

function Titulo() {
  const navigate = useNavigate();

  return (
    <div className="hero-copy-text">
      <span className="eyebrow">Reseñas musicales estilo Letterboxd</span>
      <h2>Explora álbumes, comparte reseñas y descubre nuevas canciones.</h2>
      <p>
        Crea tu lista de álbumes favoritos, califica lo que escuchas y sigue recomendaciones personalizadas basadas
        en tus gustos.
      </p>
      <div className="hero-actions">
        <button className="hero-button" type="button" onClick={() => navigate('/login')}>
          Iniciar sesión
        </button>
        <button className="hero-button hero-button-secondary" type="button" onClick={() => navigate('/register')}>
          Crear cuenta
        </button>
      </div>
    </div>
  );
}

export default Titulo;
