import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';

const API_BASE_URL = 'https://soundboard-api-gyf6.onrender.com/api';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [postLoginNavigate, setPostLoginNavigate] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos para continuar.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico con formato válido.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.mensaje || data?.error || 'Correo o contraseña incorrectos.');
        return;
      }

      if (!data?.usuario) {
        setError(data?.mensaje || 'No se pudo iniciar sesión.');
        return;
      }

      login(data.usuario);
      setAlertMessage(data.mensaje || 'Inicio de sesión exitoso.');
      setAlertOpen(true);
      setPostLoginNavigate(true);
    } catch (fetchError) {
      setError('No se pudo conectar al servidor. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card auth-page-card">
      <div className="auth-header">
        <div className="auth-brand">
          <span>MR</span>
        </div>
        <div>
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta para escribir reseñas, guardar álbumes y ver recomendaciones.</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className={error && !email.trim() ? 'field-error' : ''}>
          <span>Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@empresa.com"
          />
        </label>

        <label className={error && !password.trim() ? 'field-error' : ''}>
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </label>

        {error ? <p className="error-message">{error}</p> : null}

        <button type="submit" disabled={loading}>{loading ? 'Validando...' : 'Ingresar'}</button>
      </form>

      <div className="auth-footer">
        <p>¿No tienes cuenta? <Link to="/register">Crear cuenta</Link></p>
      </div>
      <ConfirmModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={() => {
          setAlertOpen(false);
          if (postLoginNavigate) {
            setPostLoginNavigate(false);
            navigate('/profile');
          }
        }}
        onCancel={() => setAlertOpen(false)}
      />
    </section>
  );
}

export default Login;
