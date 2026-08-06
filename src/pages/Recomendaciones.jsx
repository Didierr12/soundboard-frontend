import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Recomendaciones.css';

// ÍCONOS SVG VECTORIALES (Reemplazo de Emojis)
const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const FlameIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>
  </svg>
);

const DiscIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

// Sugerencias rápidas tipo ChatGPT
const QUICK_PROMPTS = [
  {
    icon: <HeadphonesIcon />,
    title: 'Similares a mis gustos',
    prompt: 'Recomiéndame 3 canciones basadas en mis reseñas y artistas favoritos.',
  },
  {
    icon: <MoonIcon />,
    title: 'Música Nocturna',
    prompt: 'Buscando algo de Synthwave o Lofi relajante para escuchar de noche.',
  },
  {
    icon: <FlameIcon />,
    title: 'Tendencias y Popular',
    prompt: '¿Qué canciones están destacando en la comunidad esta semana?',
  },
  {
    icon: <DiscIcon />,
    title: 'Descubrir Álbumes',
    prompt: '¿Qué álbumes aclamados por la crítica debería escuchar hoy?',
  },
];

function Recomendaciones() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'bot',
      text: '¡Hola! Soy tu asistente musical inteligente. Pídeme recomendaciones personalizadas, explora géneros o descubre nuevos lanzamientos.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);

  const getCurrentUserId = () => {
    return user?.id || user?.usuario_id || user?._id || user?.id_usuario || null;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([
        {
          id: 'guest',
          sender: 'bot',
          text: 'Necesitas iniciar sesión para recibir recomendaciones personalizadas basadas en tus reseñas.',
        },
      ]);
    }
  }, [isAuthenticated]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: `${sender}-${Date.now()}`, sender, text }]);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || !isAuthenticated) return;

    addMessage('user', query.trim());
    setInputText('');
    setIsTyping(true);
    setError('');

    const userId = getCurrentUserId();
    const endpoint = userId
      ? `https://soundboard-api-gyf6.onrender.com/api/recomendaciones/${encodeURIComponent(userId)}`
      : 'https://soundboard-api-gyf6.onrender.com/api/recomendaciones';

    try {
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensaje: query.trim(),
        }),
      });

      const data = await response.json();
      const replyText = data?.recomendaciones
        ? data.recomendaciones
            .map((item, index) => `${index + 1}. ${item.cancion} — ${item.artista}\n Razon: ${item.razon}`)
            .join('\n\n')
        : data?.mensaje || 'No se obtuvo una recomendación clara. Intenta otra pregunta.';

      addMessage('bot', replyText);
    } catch (fetchError) {
      console.error('Error fetching recommendations:', fetchError);
      setError(fetchError.message || 'Error al obtener recomendaciones.');
      addMessage('bot', 'Lo siento, hubo un error al conectar con el asistente de recomendaciones.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendMessage();
  };

  const handlePromptClick = (promptText) => {
    if (isLoading || !isAuthenticated) return;
    handleSendMessage(promptText);
  };

  return (
    <div className="recommendations-page">
      {/* Capas ambientales */}
      <div className="stage-overlay" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <section className="recommendations-hero-section">
        <div className="recommendations-hero-bg" />
        <div className="recommendations-hero-overlay" />
        <div className="recommendations-hero-card">
          <span className="hero-subtitle-tag">RECOMENDACIONES POTENCIADAS POR IA</span>
          <h1 className="hero-title-main">
            Conecta tu estado de ánimo con la música perfecta.
          </h1>
          <p className="hero-description-text">
            Deja que la IA genere listas de reproducción, descubra nuevos géneros y encuentre el ritmo exacto para cada momento.
          </p>

          <div className="hero-cta-group">
            <a href="#recommendation-chat" className="hero-btn-primary">
              Conversar con IA
            </a>
            <a href="#recommendation-chat" className="hero-btn-secondary">
              Ver sugerencias
            </a>
          </div>

          <div className="hero-card-footer">
            <span className="hero-footer-caption">UNA EXPERIENCIA MUSICAL INTELIGENTE</span>
          </div>
        </div>
      </section>

      <div className="recommendations-panel">
        <header className="recommendations-header">
          <div className="header-info">
            <span className="eyebrow-badge">
              <span className="sparkle"><SparklesIcon /></span> SoundBoard AI Assistant
            </span>
            <h1>Centro de Recomendaciones</h1>
            <p>Siente la vibra previa al show. Pide recomendaciones personalizadas a la IA antes de que empiece el concierto.</p>
          </div>

          <div className="recommendations-status">
            <div className={`status-badge ${isAuthenticated ? 'online' : 'offline'}`}>
              <span className="status-dot" />
              <span>{isAuthenticated ? `Usuario: ${user?.username || user?.nombre_completo || 'Conectado'}` : 'Sin Sesión'}</span>
            </div>
            <div className="model-badge">
              <span>IA Activa v2.5</span>
            </div>
          </div>
        </header>

        {/* Ventana de Chat */}
        <div id="recommendation-chat" className="recommendations-chat-window">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-row ${message.sender === 'bot' ? 'bot-row' : 'user-row'}`}
            >
              <div className="chat-avatar">
                {message.sender === 'bot' ? <SparklesIcon /> : <UserIcon />}
              </div>
              <div className={`chat-bubble ${message.sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
                <span className="sender-label">
                  {message.sender === 'bot' ? 'SoundBoard AI' : (user?.username || 'Tú')}
                </span>
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-row bot-row">
              <div className="chat-avatar"><SparklesIcon /></div>
              <div className="chat-bubble bot-bubble typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Sugerencias Rápidas */}
        {isAuthenticated && (
          <div className="quick-prompts-container">
            <span className="prompts-label">Sugerencias Rápidas:</span>
            <div className="quick-prompts-grid">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="prompt-card"
                  onClick={() => handlePromptClick(item.prompt)}
                  disabled={isLoading}
                >
                  <span className="prompt-icon">{item.icon}</span>
                  <div className="prompt-text">
                    <strong>{item.title}</strong>
                    <small>{item.prompt}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="recommendations-error">⚠️ {error}</div>}

        {/* Input de consulta */}
        <form className="recommendations-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder={isAuthenticated ? 'Escribe tu consulta o pide una lista de reproducción...' : 'Inicia sesión para interactuar con la IA'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!isAuthenticated || isLoading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!isAuthenticated || isLoading || !inputText.trim()}
              title="Enviar mensaje"
            >
              {isLoading ? <span className="spinner" /> : <SendIcon />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Recomendaciones;