import './Footer.css';

const footerLinks = [
  { label: 'Acerca de', url: '#' },
  { label: 'Pro', url: '#' },
  { label: 'Noticias', url: '#' },
  { label: 'Ayuda', url: '#' },
  { label: 'Contacto', url: '#' },
];

const socialIcons = [
  { label: 'Instagram', icon: '📸', url: 'https://www.instagram.com' },
  { label: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  { label: 'Facebook', icon: '📘', url: 'https://www.facebook.com' },
  { label: 'YouTube', icon: '▶️', url: 'https://www.youtube.com' },
  { label: 'TikTok', icon: '🎵', url: 'https://www.tiktok.com' },
];

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-mark">♪</div>
            <div>
              <p className="footer-title">SoundBoard</p>
              <p className="footer-description">
                Un espacio para descubrir música, crear reseñas y mantener tu biblioteca al día.
                Paneles claros, iconos rápidos y enlaces directos para navegar sin esfuerzo.
              </p>
            </div>
          </div>

          <div className="footer-widget">
            <div className="footer-column">
              <p className="footer-heading">Enlaces rápidos</p>
              {footerLinks.map((link) => (
                <a key={link.label} href={link.url}>{link.label}</a>
              ))}
            </div>
            <div className="footer-column">
              <p className="footer-heading">Redes</p>
              <div className="footer-social-icons">
                {socialIcons.map((social) => (
                  <a
                    key={social.label}
                    className="footer-social-icon"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SoundBoard</span>
          <span>Diseñado para amantes de la música y las reseñas creativas.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
