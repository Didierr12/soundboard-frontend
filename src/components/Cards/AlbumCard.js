import './AlbumCard.css';

function AlbumCard({ album }) {
  return (
    <article className="album-card">
      <div className="album-cover" style={{ backgroundImage: `url(${album.image})` }} />
      <div className="album-body">
        <div>
          <p className="album-title">{album.title}</p>
          <p className="album-artist">{album.artist}</p>
        </div>
        <div className="album-meta">
          <span className="album-stat">
            <span className="album-icon">🎧</span>
            {album.plays}
          </span>
          <span className="album-stat">
            <span className="album-icon">❤️</span>
            {album.likes}
          </span>
        </div>
      </div>
    </article>
  );
}

export default AlbumCard;
