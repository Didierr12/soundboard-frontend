import { useEffect, useState } from 'react';
import './Trending.css';

const placeholderImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80';

function Trending() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopSongs = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('https://soundboard-api-gyf6.onrender.com/api/resenas/top-canciones');
        if (!response.ok) {
          throw new Error('No se pudo cargar el top de canciones.');
        }

        const data = await response.json();
        setSongs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando top canciones:', err);
        setError(err.message || 'Error al cargar canciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopSongs();
  }, []);

  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2>Lo más popular del momento</h2>
        <p>Checa lo que todo mundo está escuchando ahora mismo.</p>
      </div>
      {error ? (
        <div className="trending-error">{error}</div>
      ) : (
        <div className="trending-scroller">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="trending-card trending-card-loading">
                <div className="trending-card-cover shimmer" />
                <div className="trending-card-body">
                  <div className="trending-card-title shimmer" />
                  <div className="trending-card-subtitle shimmer" />
                  <div className="trending-card-meta shimmer" />
                </div>
              </div>
            ))
          ) : songs.length === 0 ? (
            <div className="trending-empty">Aún no hay canciones reseñadas recientemente.</div>
          ) : (
            songs.map((song) => (
              <article key={song.spotify_album_id || song.titulo_album} className="trending-card">
                <div
                  className="trending-card-cover"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.56)), url(${song.imagen_url || placeholderImage})` }}
                />
                <div className="trending-card-body">
                  <p className="trending-card-category">Reseñas: {song.review_count}</p>
                  <h3 className="trending-card-title">{song.titulo_album || 'Canción anónima'}</h3>
                  <p className="trending-card-subtitle">{song.artista || 'Artista desconocido'}</p>
                  <div className="trending-card-meta">
                    <span>{song.review_count} reviews</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default Trending;
