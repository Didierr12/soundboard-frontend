import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import './Profile.css';

function Profile() {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');

  // Estado para la edición de perfil de usuario
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Estados para la edición individual de reseñas
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [editReviewComment, setEditReviewComment] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  
  // Modal de aviso para errores
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const loadFavoriteArtists = async (userId) => {
    if (!userId) return [];
    try {
      const response = await fetch(`http://localhost:5001/api/usuarios/${encodeURIComponent(userId)}/favoritos`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los artistas favoritos.');
      }
      const data = await response.json();
      return Array.isArray(data)
        ? data.map((item) => ({
            id: item.spotify_artist_id,
            name: item.nombre || item.name || 'Artista',
            image: item.imagen_url || item.image || '',
            seguidores: item.seguidores || 0,
          }))
        : [];
    } catch (error) {
      console.error('Error leyendo favoritos de backend:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setFavoriteArtists([]);
      setReviews([]);
      return;
    }

    const userId = user?.id || user?.usuario_id || user?._id || user?.id_usuario || null;
    if (userId) {
      fetchReviews(userId);
      loadFavoriteArtists(userId).then(setFavoriteArtists);
    }
  }, [isAuthenticated, user]);

  const fetchReviews = async (userId) => {
    setReviewsLoading(true);
    setReviewsError('');

    try {
      const response = await fetch(`http://localhost:5001/api/resenas/usuario/${encodeURIComponent(userId)}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar tus reseñas.');
      }

      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewsError(error.message || 'Error al cargar reseñas.');
    } finally {
      setReviewsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // LÓGICA DE ELIMINACIÓN Y EDICIÓN DE RESEÑAS
  // ---------------------------------------------------------------------------

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/resenas/${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la reseña');
      }

      // Remover de la lista local
      setReviews((prev) => prev.filter((r) => (r.id || r.resenaId) !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      setAlertMessage('No se pudo eliminar la reseña. Inténtalo de nuevo.');
      setAlertOpen(true);
    }
  };

  const handleStartEditReview = (review) => {
    const rId = review.id || review.resenaId;
    setEditingReviewId(rId);
    setEditReviewRating(review.calificacion || 5);
    setEditReviewComment(review.comentario || '');
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setEditReviewComment('');
  };

  const handleSaveReview = async (reviewId) => {
    if (!editReviewComment.trim()) return;

    setReviewSaving(true);
    try {
      const response = await fetch(`http://localhost:5001/api/resenas/${encodeURIComponent(reviewId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calificacion: editReviewRating,
          comentario: editReviewComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reseña');
      }

      // Actualizar estado local
      setReviews((prev) =>
        prev.map((r) => {
          if ((r.id || r.resenaId) === reviewId) {
            return { ...r, calificacion: editReviewRating, comentario: editReviewComment.trim() };
          }
          return r;
        })
      );

      setEditingReviewId(null);
    } catch (error) {
      console.error('Error updating review:', error);
      setAlertMessage('No se pudo actualizar la reseña.');
      setAlertOpen(true);
    } finally {
      setReviewSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // LÓGICA DE EDICIÓN DE PERFIL
  // ---------------------------------------------------------------------------

  const handleStartEdit = () => {
    setEditUsername(user?.username || user?.nombre_completo || '');
    setEditBio(user?.biografia || '');
    setProfileError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileError('');
  };

  const handleSaveProfile = async () => {
    const userId = user?.id || user?.usuario_id || user?._id || user?.id_usuario;
    if (!userId) return;

    const usernameValue = editUsername.trim();
    if (!usernameValue) {
      setProfileError('El nombre de usuario es obligatorio.');
      return;
    }

    setProfileSaving(true);
    setProfileError('');

    try {
      const response = await fetch(`http://localhost:5001/api/usuarios/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameValue, biografia: editBio.trim() }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo guardar el perfil.');
      }

      const nextUser = { ...user, username: usernameValue, biografia: editBio.trim() };
      updateUser(nextUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError(error.message || 'No se pudo guardar el perfil.');
    } finally {
      setProfileSaving(false);
    }
  };

  const userInitial = (user?.username || user?.nombre_completo || 'U').charAt(0).toUpperCase();

  return (
    <section className="profile-page">
      <div className="profile-container">
        {isAuthenticated ? (
          <>
            <header className="profile-header">
              <div className="avatar">{userInitial}</div>
              <div className="user-info">
                {isEditing ? (
                  <div className="edit-profile-form">
                    <label>
                      <span>Nombre de usuario</span>
                      <input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                    </label>
                    <label>
                      <span>Biografía</span>
                      <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={4} />
                    </label>
                    {profileError ? <p className="profile-note error">{profileError}</p> : null}
                    <div className="edit-profile-actions">
                      <button type="button" className="primary-btn" onClick={handleSaveProfile} disabled={profileSaving}>
                        {profileSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button type="button" className="secondary-btn" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1>{user?.username || user?.nombre_completo || 'Usuario'}</h1>
                    <p className="bio">{user?.biografia || 'Me gusta descubrir nueva música y compartir reseñas honestas.'}</p>
                  </>
                )}
                <div className="stats">
                  <div>
                    <strong>Reseñas</strong>
                    <div>{reviews.length}</div>
                  </div>
                  <div>
                    <strong>Favoritos</strong>
                    <div>{favoriteArtists.length}</div>
                  </div>
                </div>
                {!isEditing && (
                  <button type="button" className="edit-profile-toggle" onClick={handleStartEdit}>Editar perfil</button>
                )}
              </div>
            </header>

            <section className="profile-sections">
              <div className="favorites">
                <h2>Artistas favoritos</h2>
                {favoriteArtists.length === 0 ? (
                  <p className="profile-note">No tienes artistas favoritos aún. Marca un artista con el corazón en la búsqueda.</p>
                ) : (
                  <div className="favorites-grid">
                    {favoriteArtists.map((artist, index) => (
                      <div key={artist.id || index} className="fav-card">
                        <div className="fav-thumb">
                          {artist.image ? (
                            <img src={artist.image} alt={artist.name} />
                          ) : (
                            <div className="review-cover-placeholder" />
                          )}
                        </div>
                        <div className="fav-name">{artist.name}</div>
                        <div className="fav-followers">{artist.seguidores || 0} seguidores</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="user-reviews">
                <h2>Mis reseñas</h2>
                {reviewsLoading ? (
                  <p className="profile-note">Cargando tus reseñas...</p>
                ) : reviewsError ? (
                  <p className="profile-note error">{reviewsError}</p>
                ) : reviews.length === 0 ? (
                  <p className="profile-note">Aún no tienes reseñas. Busca un álbum y comparte tu opinión.</p>
                ) : (
                  <ul>
                    {reviews.map((review) => {
                      const reviewId = review.id || review.resenaId;
                      const isEditingThis = editingReviewId === reviewId;

                      return (
                        <li key={reviewId || `${review.spotify_album_id}-${review.fecha_creacion}`} className="review-row">
                          <div className="review-header-wrapper">
                            <div className="review-meta">
                              <div className="review-cover">
                                {review.imagen_url ? (
                                  <img src={review.imagen_url} alt={review.titulo_album || review.titulo} />
                                ) : (
                                  <div className="review-cover-placeholder" />
                                )}
                              </div>
                              <div>
                                <div className="review-target">{review.titulo_album || review.titulo}</div>
                                <div className="review-type">{review.artista || 'Artista'}</div>
                              </div>
                            </div>

                            {/* Acciones: Editar y Borrar */}
                            {!isEditingThis && (
                              <div className="review-actions">
                                <button
                                  type="button"
                                  className="review-action-btn edit"
                                  onClick={() => handleStartEditReview(review)}
                                  title="Editar reseña"
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  type="button"
                                  className="review-action-btn delete"
                                  onClick={() => handleDeleteReview(reviewId)}
                                  title="Eliminar reseña"
                                >
                                  🗑️ Borrar
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Modo Edición Inline */}
                          {isEditingThis ? (
                            <div className="edit-review-box">
                              <div className="edit-review-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    className={`star-edit-btn ${star <= editReviewRating ? 'active' : ''}`}
                                    onClick={() => setEditReviewRating(star)}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                              <textarea
                                className="edit-review-textarea"
                                value={editReviewComment}
                                onChange={(e) => setEditReviewComment(e.target.value)}
                                placeholder="Edita tu comentario..."
                              />
                              <div className="edit-review-btns">
                                <button
                                  type="button"
                                  className="btn-small-primary"
                                  onClick={() => handleSaveReview(reviewId)}
                                  disabled={reviewSaving}
                                >
                                  {reviewSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                  type="button"
                                  className="btn-small-secondary"
                                  onClick={handleCancelEditReview}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Modo Lectura Normal */
                            <div className="review-body">
                              <div className="review-rating">
                                {Array.from({ length: review.calificacion || 0 }).map((_, i) => '★').join('')}
                              </div>
                              <div className="review-text">{review.comentario}</div>
                              {review.fecha_creacion && (
                                <div className="review-date">
                                  {new Date(review.fecha_creacion).toLocaleDateString('es-ES')}
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="auth-locked">
            <h1>Perfil bloqueado</h1>
            <p>Para ver tu perfil y recomendaciones, inicia sesión primero.</p>
            <Link className="auth-button" to="/login">
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>

      <ConfirmModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        confirmText="Aceptar"
        cancelText="Cerrar"
        onConfirm={() => setAlertOpen(false)}
        onCancel={() => setAlertOpen(false)}
      />

    </section>
  );
}

export default Profile;