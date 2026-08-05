import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Trending from '../components/Trending/Trending';
import Footer from '../components/Footer/Footer';
import './Home.css';

const exploreItems = [
  {
    icon: '🤖',
    title: 'Recomendaciones con IA',
    description: 'Sugerencias personalizadas basadas en tus gustos, historial y estado de ánimo.',
  },
  {
    icon: '💬',
    title: 'Comunidad y Reseñas',
    description: 'Lee opiniones de otros usuarios, califica álbumes y comparte tu punto de vista.',
  },
  {
    icon: '🎵',
    title: 'Catálogo Integrado',
    description: 'Accede a un catálogo completo alimentado por la API oficial de Spotify.',
  },
];

const fallbackReview = [
  {
    title: 'Sin reseñas aún',
    score: '5.0',
    author: 'SoundBoard',
    text: 'Aún no hay publicaciones en la comunidad. ¡Sé el primero en calificar tus temas favoritos!',
    empty: true,
  },
];

function Home() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [stats, setStats] = useState({ totalReviews: 0, totalUsers: 0, totalSongs: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchGlobalReviews = async () => {
      setReviewsLoading(true);
      setReviewsError('');

      try {
        const response = await fetch('https://soundboard-api-gyf6.onrender.com/api/resenas');
        if (!response.ok) throw new Error('No se pudieron obtener las reseñas.');
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
        setReviewsError(error.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchGlobalReviews();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);

      try {
        const response = await fetch('https://soundboard-api-gyf6.onrender.com/api/estadisticas');
        if (!response.ok) throw new Error('No se pudieron obtener las estadísticas.');

        const data = await response.json();
        setStats({
          totalReviews: data.totalReviews ?? 0,
          totalUsers: data.totalUsers ?? 0,
          totalSongs: data.totalSongs ?? 0,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayedReviews = reviews.length > 0 ? reviews.slice(0, 4) : fallbackReview;

  return (
    <div className="home-container">
      {/* NAVEGACIÓN SECUNDARIA CENTRADA */}
      <div className="home-constrained-wrapper">
        <nav className="home-subindex" aria-label="Navegación rápida">
          <span className="subindex-label">SoundBoard</span>
          <a href="#explorar">Funciones</a>
          <a href="#popular">Tendencias</a>
          <a href="#reseñas">Reseñas</a>
          <a href="#destacados">Descubrir</a>
        </nav>
      </div>

      {/* HERO A ANCHO COMPLETO (100% SCREEN WIDTH) */}
      <div className="home-hero-fullwidth">
        <Hero />
      </div>

      {/* RESTO DE CONTENIDO CENTRADO */}
      <div className="home-constrained-wrapper">
        {/* SECCIÓN PRINCIPAL / ESTADÍSTICAS */}
        <section className="home-showcase">
          <article className="home-panel">
            <h1>Tu espacio para explorar, calificar y descubrir música</h1>
            <p>
              SoundBoard integra el catálogo de Spotify con análisis de Inteligencia Artificial
              y una comunidad activa para explorar canciones, álbumes y opiniones en un solo lugar.
            </p>
            <div className="home-actions">
              <button
                type="button"
                className="home-btn primary"
                onClick={() => navigate('/recomendaciones')}
              >
                Probar Recomendaciones IA
              </button>
              <button
                type="button"
                className="home-btn secondary"
                onClick={() => navigate('/review')}
              >
                Explorar Reseñas
              </button>
            </div>

            <div className="home-metrics">
              <div className="metric-card">
                <span>Reseñas</span>
                <strong>{statsLoading ? '...' : stats.totalReviews}</strong>
              </div>
              <div className="metric-card">
                <span>Usuarios</span>
                <strong>{statsLoading ? '...' : stats.totalUsers}</strong>
              </div>
              <div className="metric-card">
                <span>Canciones</span>
                <strong>{statsLoading ? '...' : stats.totalSongs}</strong>
              </div>
            </div>
          </article>

          <aside className="home-highlights">
            <div className="highlight-info">
              <h3>Experiencia Personalizada</h3>
              <p>
                Guarda tus pistas favoritas, evalúa nuevos lanzamientos y deja tu huella en la comunidad.
              </p>
            </div>
            <div className="highlight-grid">
              <div className="highlight-pill">
                <span>IA</span>
                <strong>Sugerencias Smart</strong>
              </div>
              <div className="highlight-pill">
                <span>Spotify</span>
                <strong>Búsqueda Directa</strong>
              </div>
              <div className="highlight-pill">
                <span>Rating</span>
                <strong>Escala 1 a 5★</strong>
              </div>
              <div className="highlight-pill">
                <span>Filtros</span>
                <strong>Álbumes y Temas</strong>
              </div>
            </div>
          </aside>
        </section>

        {/* SECCIÓN FUNCIONALIDADES */}
        <section id="explorar" className="home-section">
          <header className="section-header">
            <h2>Características Principales</h2>
            <p>Todo lo que necesitas para enriquecer tu escucha diaria.</p>
          </header>
          <div className="explore-grid">
            {exploreItems.map((item) => (
              <div key={item.title} className="explore-card">
                <span className="explore-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN TENDENCIAS */}
        <section id="popular" className="home-section">
          <Trending />
        </section>

        {/* SECCIÓN RESEÑAS */}
        <section id="reseñas" className="home-section">
          <header className="section-header">
            <h2>Últimas Reseñas</h2>
            <p>Descubre las valoraciones más recientes de la comunidad.</p>
            {reviewsError && <p className="error-message">No se pudieron cargar las reseñas recientes.</p>}
          </header>

          <div className="reviews-grid">
            {reviewsLoading ? (
              <div className="review-card loading">
                <h3>Cargando información...</h3>
                <p>Obteniendo las últimas publicaciones.</p>
              </div>
            ) : (
              displayedReviews.map((item, index) => (
                <article key={`${item.id || item.title}-${index}`} className="review-card">
                  <h3>{item.empty ? item.title : item.titulo_album}</h3>
                  <p>{item.empty ? item.text : (item.comentario || 'Sin comentario adicional.')}</p>
                  <footer className="review-footer">
                    <span className="rating">★ {item.empty ? item.score : (Number(item.calificacion) || 0).toFixed(1)}</span>
                    <span className="author">Por {item.empty ? item.author : (item.autor || 'Anónimo')}</span>
                  </footer>
                </article>
              ))
            )}
          </div>
        </section>

        {/* LLAMADO A LA ACCIÓN FINAL */}
        <section id="destacados" className="home-cta">
          <div className="cta-content">
            <h2>¿Listo para descubrir nueva música?</h2>
            <p>
              Genera recomendaciones automáticas basadas en tu perfil o comparte tu opinión sobre tus artistas preferidos.
            </p>
            <div className="cta-actions">
              <button
                type="button"
                className="home-btn primary"
                onClick={() => navigate('/recomendaciones')}
              >
                Generar con IA
              </button>
              <button
                type="button"
                className="home-btn secondary"
                onClick={() => navigate('/review')}
              >
                Escribir Reseña
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default Home;