import React, { useContext, useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer/Footer';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import './Review.css';

// Formateador de fecha para la comunidad
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

// Clasificación inteligente de tipo
const getTypeLabel = (item) => {
  if (!item) return 'Álbum';

  if (typeof item === 'string') {
    const t = item.toLowerCase().trim();
    if (t.includes('cancion') || t.includes('canción') || t.includes('track') || t.includes('single')) return 'Canción';
    if (t.includes('artist') || t.includes('artista')) return 'Artista';
    if (t.includes('album') || t.includes('álbum') || t.includes('disco')) return 'Álbum';
    return item.charAt(0).toUpperCase() + item.slice(1);
  }

  const rawType = item.tipo || item.tipo_item || item.type || item.categoria || item.category;
  if (rawType) {
    const t = String(rawType).toLowerCase().trim();
    if (t.includes('cancion') || t.includes('canción') || t.includes('track') || t.includes('single')) return 'Canción';
    if (t.includes('artist') || t.includes('artista')) return 'Artista';
    if (t.includes('album') || t.includes('álbum') || t.includes('disco')) return 'Álbum';
  }

  if (item.duration_ms || item.preview_url || item.track_number || item.is_local !== undefined) {
    return 'Canción';
  }

  if (item.followers || (item.genres && !item.album)) return 'Artista';
  if (item.album_type || item.total_tracks) return 'Álbum';

  const artistStr = String(item.artista || item.artist || '').toLowerCase().trim();
  const titleStr = String(item.titulo_album || item.titulo || item.name || '').toLowerCase().trim();

  if (artistStr === 'artista principal' || (artistStr && artistStr === titleStr)) {
    return 'Artista';
  }

  return 'Álbum';
};

const getBadgeClass = (item) => {
  const label = getTypeLabel(item);
  if (label === 'Canción') return 'badge-cancion';
  if (label === 'Artista') return 'badge-artista';
  return 'badge-album';
};

const getItemImage = (item) => {
  if (!item) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop';
  if (typeof item === 'string' && item.startsWith('http')) return item;

  if (item.imagen_url && item.imagen_url.startsWith('http')) return item.imagen_url;
  if (item.image && item.image.startsWith('http')) return item.image;

  if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url) {
    return item.images[0].url;
  }
  if (item.album?.images && Array.isArray(item.album.images) && item.album.images[0]?.url) {
    return item.album.images[0].url;
  }
  return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop';
};

const getItemArtist = (item) => {
  if (!item) return '';

  const type = getTypeLabel(item);

  if (type === 'Artista') {
    if (item.artista && item.artista !== 'Artista principal') return item.artista;
    if (item.artist && item.artist !== 'Artista principal') return item.artist;
    return item.name || item.titulo || item.titulo_album || '';
  }

  if (item.artista && item.artista !== 'Artista principal') return item.artista;
  if (item.artist && item.artist !== 'Artista principal') return item.artist;

  if (Array.isArray(item.artists) && item.artists.length > 0) {
    return item.artists
      .map((a) => (typeof a === 'string' ? a : a.name || ''))
      .filter(Boolean)
      .join(', ');
  }

  return '';
};

const getItemId = (item) => String(item?.id || item?.spotify_artist_id || item?.spotify_album_id || item?.uri || '');

const extractItemsFromSearchResponse = (res) => {
  if (!res) return [];

  const categorias = res.categorias || res.data?.categorias;
  if (categorias) {
    const canciones = (categorias.canciones || categorias.tracks || []).map((item) => ({ ...item, tipo: 'cancion' }));
    const albumes = (categorias.albumes || categorias.albums || []).map((item) => ({ ...item, tipo: 'album' }));
    const artistas = (categorias.artistas || categorias.artists || []).map((item) => ({ ...item, tipo: 'artista' }));

    const interleaved = [];
    const maxLength = Math.max(canciones.length, albumes.length, artistas.length);

    for (let i = 0; i < maxLength; i++) {
      if (canciones[i]) interleaved.push(canciones[i]);
      if (albumes[i]) interleaved.push(albumes[i]);
      if (artistas[i]) interleaved.push(artistas[i]);
    }

    if (interleaved.length > 0) return interleaved;
  }

  if (Array.isArray(res.resultados)) {
    return res.resultados.map((item) => ({
      ...item,
      tipo: item.tipo || getTypeLabel(item).toLowerCase(),
    }));
  }

  const data = res.data || res;
  if (Array.isArray(data)) return data;

  const albums = (data.albums?.items || []).map((i) => ({ ...i, tipo: 'album' }));
  const tracks = (data.tracks?.items || []).map((i) => ({ ...i, tipo: 'cancion' }));
  const artists = (data.artists?.items || []).map((i) => ({ ...i, tipo: 'artista' }));

  const interleaved = [];
  const maxLength = Math.max(albums.length, tracks.length, artists.length);

  for (let i = 0; i < maxLength; i++) {
    if (tracks[i]) interleaved.push(tracks[i]);
    if (albums[i]) interleaved.push(albums[i]);
    if (artists[i]) interleaved.push(artists[i]);
  }

  return interleaved;
};

// Imágenes para el slider hero estilizado
const HERO_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1920&auto=format&fit=crop'
];

function Review() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const { user, isAuthenticated } = useContext(AuthContext);
  const [favoriteArtistIds, setFavoriteArtistIds] = useState([]);
  const [selectedArtistFollowers, setSelectedArtistFollowers] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [publicReviews, setPublicReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [heroIndex, setHeroIndex] = useState(0);

  const searchContainerRef = useRef(null);

  const selectedItemId = getItemId(selectedItem);
  const isArtistSelected = selectedItem && getTypeLabel(selectedItem) === 'Artista';
  const isFavorite = isArtistSelected && selectedItemId && favoriteArtistIds.includes(selectedItemId);

  // Auto carrusel hero
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % HERO_BACKGROUNDS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentUserId = () => {
    const currentUser = user || {};
    return currentUser?.id || currentUser?.usuario_id || currentUser?._id || currentUser?.id_usuario || null;
  };

  const fetchUserFavorites = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setFavoriteArtistIds([]);
      return;
    }

    try {
      const res = await fetch(`https://soundboard-api-gyf6.onrender.com/api/usuarios/${encodeURIComponent(userId)}/favoritos`);
      if (res.ok) {
        const data = await res.json();
        const ids = Array.isArray(data) ? data.map((fav) => String(fav.spotify_artist_id)) : [];
        setFavoriteArtistIds(ids);
      }
    } catch (err) {
      console.error('Error al cargar favoritos del usuario:', err);
    }
  };

  const fetchArtistFollowers = async (spotifyArtistId) => {
    if (!spotifyArtistId) {
      setSelectedArtistFollowers(0);
      return;
    }

    try {
      const res = await fetch(`https://soundboard-api-gyf6.onrender.com/api/favoritos/artista/${encodeURIComponent(spotifyArtistId)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedArtistFollowers(data.seguidores ?? 0);
      }
    } catch (err) {
      console.error('Error al obtener seguidores del artista:', err);
      setSelectedArtistFollowers(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserFavorites();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isArtistSelected && selectedItemId) {
      fetchArtistFollowers(selectedItemId);
    } else {
      setSelectedArtistFollowers(0);
    }
  }, [isArtistSelected, selectedItemId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setShowFilterOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchPublicReviews();
  }, []);

  const fetchPublicReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch('https://soundboard-api-gyf6.onrender.com/api/resenas');
      if (res.ok) {
        const data = await res.json();
        setPublicReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error cargando reseñas:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const executeSearch = async (queryText) => {
    if (!queryText || queryText.trim().length === 0) {
      setSuggestions([]);
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `https://soundboard-api-gyf6.onrender.com/api/spotify/buscar?q=${encodeURIComponent(queryText.trim())}`
      );

      if (res.ok) {
        const data = await res.json();
        const items = extractItemsFromSearchResponse(data);
        setSearchResults(items);
        setSuggestions(items.slice(0, 6));
      }
    } catch (err) {
      console.error('Error al realizar búsqueda:', err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
    executeSearch(value);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    executeSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setShowSuggestions(false);
    if (item.name || item.titulo || item.titulo_album) {
      setSearchTerm(item.name || item.titulo || item.titulo_album);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isArtistSelected || !selectedItemId) return;

    const userId = getCurrentUserId();
    if (!userId) {
      setAlertMessage('Inicia sesión para guardar artistas favoritos.');
      setAlertOpen(true);
      return;
    }

    const artistId = selectedItemId;
    const title = selectedItem.name || selectedItem.titulo || selectedItem.titulo_album || 'Artista';
    const image = getItemImage(selectedItem);

    try {
      if (isFavorite) {
        const res = await fetch(
          `https://soundboard-api-gyf6.onrender.com/api/usuarios/${encodeURIComponent(userId)}/favoritos/${encodeURIComponent(artistId)}`,
          { method: 'DELETE' }
        );

        if (res.ok) {
          setFavoriteArtistIds((prev) => prev.filter((id) => id !== artistId));
          await fetchUserFavorites();
          await fetchArtistFollowers(artistId);
        }
      } else {
        const res = await fetch(`https://soundboard-api-gyf6.onrender.com/api/usuarios/${encodeURIComponent(userId)}/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spotify_artist_id: artistId, nombre: title, imagen_url: image }),
        });

        if (res.ok) {
          setFavoriteArtistIds((prev) => Array.from(new Set([...prev, artistId])));
          await fetchUserFavorites();
          await fetchArtistFollowers(artistId);
        }
      }
    } catch (err) {
      console.error('Error al cambiar favorito:', err);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const userId = getCurrentUserId();
    if (!userId) {
      setAlertMessage('Debes iniciar sesión para publicar una reseña.');
      setAlertOpen(true);
      return;
    }

    setIsPublishing(true);
    try {
      const resolvedTitle = selectedItem.name || selectedItem.titulo || selectedItem.titulo_album || '';
      const resolvedType = getTypeLabel(selectedItem);
      const resolvedArtist = resolvedType === 'Artista' ? resolvedTitle : getItemArtist(selectedItem);
      const resolvedImage = getItemImage(selectedItem);

      const payload = {
        usuario_id: userId,
        spotify_album_id: selectedItem.id || selectedItem.spotify_album_id || selectedItem.uri || 'custom-id',
        titulo_album: resolvedTitle,
        artista: resolvedArtist,
        imagen_url: resolvedImage,
        tipo: resolvedType,
        calificacion: rating,
        comentario: comment.trim() || '',
      };

      const res = await fetch('https://soundboard-api-gyf6.onrender.com/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setComment('');
        setSelectedItem(null);
        setSearchTerm('');
        setSearchResults([]);
        fetchPublicReviews();
      }
    } catch (err) {
      console.error('Error publicando reseña:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const filterMatch = (item) => {
    if (filterType === 'Todos') return true;
    const label = getTypeLabel(item);
    if (filterType === 'Álbumes') return label === 'Álbum';
    if (filterType === 'Artistas') return label === 'Artista';
    if (filterType === 'Canciones') return label === 'Canción';
    return true;
  };

  const filteredResults = searchResults.filter(filterMatch);
  const filteredSuggestions = suggestions.filter(filterMatch);

  return (
    <div className="review-page-container">
      {/* HERO BANNER CON IMAGEN DE FONDO Y TARJETA GLASSMORPHISM EXACTA A LA FOTO DE REFERENCIA */}
      <section className="review-hero-section">
        <div className="hero-background-carousel">
          {HERO_BACKGROUNDS.map((bgUrl, idx) => (
            <div
              key={idx}
              className={`hero-bg-slide ${idx === heroIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${bgUrl})` }}
            />
          ))}
          <div className="hero-vignette-overlay" />
        </div>

        <div className="hero-banner-container">
          <div className="hero-glass-card">
            <span className="hero-subtitle-tag">RESEÑAS MUSICALES ESTILO LETTERBOXD</span>
            <h1 className="hero-title-main">
              Explora álbumes, comparte reseñas y descubre nuevas canciones.
            </h1>
            <p className="hero-description-text">
              Crea tu lista de álbumes favoritos, califica lo que escuchas y sigue recomendaciones personalizadas basadas en tus gustos.
            </p>

            <div className="hero-cta-group">
              <a href="#buscar-seccion" className="hero-btn-primary">
                Iniciar sesión
              </a>
              <a href="#buscar-seccion" className="hero-btn-secondary">
                Crear cuenta
              </a>
            </div>

            <div className="hero-card-footer">
              <span className="hero-footer-caption">COMPARTE TU MÚSICA FAVORITA</span>
              <div className="hero-carousel-dots">
                {HERO_BACKGROUNDS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`carousel-dot ${idx === heroIndex ? 'active' : ''}`}
                    onClick={() => setHeroIndex(idx)}
                    aria-label={`Ver diapositiva ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GRID DE BÚSQUEDA Y FORMULARIO */}
        <div className="review-hero-grid" id="buscar-seccion">
          {/* PANEL IZQUIERDO: BUSCADOR Y RESULTADOS */}
          <div className="review-search-panel">
            <div className="search-box-wrapper" ref={searchContainerRef}>
              <form className="search-bar-inner" onSubmit={handleSearchSubmit}>
                {/* Dropdown de Filtro */}
                <div className="filter-dropdown-wrapper">
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFilterOptions((s) => !s);
                    }}
                  >
                    <span>{filterType}</span>
                    <span className="dropdown-arrow">▾</span>
                  </button>

                  {showFilterOptions && (
                    <div className="filter-dropdown-menu">
                      {['Todos', 'Álbumes', 'Artistas', 'Canciones'].map((f) => (
                        <button
                          key={f}
                          type="button"
                          className={`filter-item ${filterType === f ? 'active' : ''}`}
                          onClick={() => {
                            setFilterType(f);
                            setShowFilterOptions(false);
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="search-divider" />

                {/* Input Principal */}
                <input
                  type="text"
                  className="search-input-field"
                  placeholder="Buscar artista, canción o álbum..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />

                {searchTerm && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={handleClearSearch}
                    title="Borrar texto"
                  >
                    ✕
                  </button>
                )}

                <button
                  type="submit"
                  className="search-submit-btn"
                  title="Buscar"
                >
                  🔍
                </button>
              </form>

              {/* Autocompletado */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {filteredSuggestions.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="autocomplete-item"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="autocomplete-left">
                        <img
                          src={getItemImage(item)}
                          alt={item.name || item.titulo || item.titulo_album}
                          className="autocomplete-thumb"
                        />
                        <div className="autocomplete-info">
                          <strong>{item.name || item.titulo || item.titulo_album}</strong>
                          <span>{getItemArtist(item)}</span>
                        </div>
                      </div>
                      <span className={`card-badge ${getBadgeClass(item)}`}>
                        {getTypeLabel(item)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grid de Resultados de Búsqueda */}
            <div className="results-grid">
              {filteredResults.map((item, idx) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id || idx}
                    className={`result-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className="result-card-img-wrapper">
                      <img
                        src={getItemImage(item)}
                        alt={item.name || item.titulo || item.titulo_album}
                        className="result-card-img"
                      />
                      <div className="result-card-overlay-glow" />
                    </div>
                    <div className="result-card-info">
                      <div className="result-card-header">
                        <h3>{item.name || item.titulo || item.titulo_album}</h3>
                        <span className={`card-badge ${getBadgeClass(item)}`}>
                          {getTypeLabel(item)}
                        </span>
                      </div>
                      <p>{getItemArtist(item)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL DERECHO: FORMULARIO DE RESEÑA */}
          <div className="review-form-panel">
            <h3 className="form-title">Escribir Reseña</h3>

            {selectedItem ? (
              <div className="selected-preview-card">
                <div className="selected-preview-content">
                  <img
                    src={getItemImage(selectedItem)}
                    alt={selectedItem.name || selectedItem.titulo || selectedItem.titulo_album}
                    className="selected-preview-img"
                  />
                  <div className="selected-preview-info">
                    <span className={`card-badge ${getBadgeClass(selectedItem)}`}>
                      {getTypeLabel(selectedItem)}
                    </span>
                    <h4>{selectedItem.name || selectedItem.titulo || selectedItem.titulo_album}</h4>
                    <p>{getItemArtist(selectedItem)}</p>
                    {getTypeLabel(selectedItem) === 'Artista' && (
                      <p className="artist-followers">
                        {selectedArtistFollowers.toLocaleString()} seguidores
                      </p>
                    )}
                  </div>
                </div>

                {getTypeLabel(selectedItem) === 'Artista' && (
                  <button
                    type="button"
                    className={`favorite-heart-btn ${isFavorite ? 'is-favorite' : ''}`}
                    onClick={handleToggleFavorite}
                    title={isFavorite ? 'Quitar de favoritos' : 'Guardar artista favorito'}
                    aria-label={isFavorite ? 'Artista favorito' : 'Marcar como favorito'}
                  >
                    ♥
                  </button>
                )}
              </div>
            ) : (
              <div className="selected-placeholder">
                <div className="placeholder-icon">🎵</div>
                <p>Busca y selecciona un álbum, canción o artista para comenzar tu reseña.</p>
              </div>
            )}

            {/* Sistema de Calificación con Estrellas */}
            <div className="rating-selector-group">
              <label className="rating-label">Calificación:</label>
              <div className="star-rating-container">
                {[1, 2, 3, 4, 5].map((i) => {
                  const isFull = rating >= i;
                  const isHalf = rating === i - 0.5;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`star-btn ${isFull ? 'full' : ''} ${isHalf ? 'half' : ''}`}
                      onClick={() => setRating(rating === i ? i - 0.5 : i)}
                      title={`${i} estrellas`}
                    >
                      <span className="star-back">★</span>
                      <span className="star-front">★</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campo de Comentario */}
            <textarea
              className="review-textarea"
              placeholder="¿Qué te pareció este lanzamiento? Escribe tu reseña... (Opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="button"
              className="review-submit-btn"
              disabled={!selectedItem || isPublishing}
              onClick={handlePublish}
            >
              {isPublishing ? 'Publicando...' : 'Publicar Reseña →'}
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR: FEED DE RESEÑAS */}
      <section className="review-feed-section">
        <div className="review-section-header">
          <h2>Reseñas en tendencia</h2>
          <p>Opiniones y comentarios creados recientemente por la comunidad de SoundBoard.</p>
        </div>

        <div className="review-cards-grid">
          {loadingReviews ? (
            <div className="feed-loading-container">
              <div className="pulsing-spinner" />
              <p className="feed-loading-text">Cargando opiniones de la comunidad...</p>
            </div>
          ) : publicReviews.length > 0 ? (
            publicReviews.map((rev, idx) => {
              const itemTypeLabel = getTypeLabel(rev);
              const artistName = getItemArtist(rev);
              const formattedCreatedDate = formatDate(rev.fecha_creacion || rev.created_at);
              const numCalificacion = Number(rev.calificacion) || 0;

              return (
                <article key={rev.id || idx} className="feed-review-card">
                  <div className="feed-card-header">
                    <div className="feed-card-thumb-wrapper">
                      <img
                        src={getItemImage(rev)}
                        alt={rev.titulo_album || rev.titulo || 'Música'}
                        className="feed-card-thumb"
                      />
                    </div>
                    <div className="feed-card-item-info">
                      <span className={`card-badge ${getBadgeClass(rev)}`}>
                        {itemTypeLabel}
                      </span>
                      <h3 className="feed-item-title">{rev.titulo_album || rev.titulo || rev.name}</h3>
                      {artistName && itemTypeLabel !== 'Artista' && artistName !== 'Artista principal' && (
                        <p className="feed-item-artist">
                          de <strong>{artistName}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="feed-card-body">
                    <div className="feed-rating-stars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={`neon-star ${numCalificacion >= i ? 'full' : ''}`}>
                          ★
                        </span>
                      ))}
                      <span className="rating-number">({numCalificacion.toFixed(1)})</span>
                    </div>
                    {rev.comentario && <p className="feed-comment">"{rev.comentario}"</p>}
                  </div>

                  <div className="feed-card-meta">
                    <span>Reseña por <strong>{rev.autor || rev.usuario_nombre || `Usuario #${rev.usuario_id}`}</strong></span>
                    {formattedCreatedDate && (
                      <span className="feed-card-date">
                        {formattedCreatedDate}
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <p className="feed-empty-text">
              Aún no hay reseñas. ¡Sé el primero en compartir tu opinión arriba!
            </p>
          )}
        </div>
      </section>

      <ConfirmModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        confirmText="Aceptar"
        cancelText="Cerrar"
        onConfirm={() => setAlertOpen(false)}
        onCancel={() => setAlertOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default Review;