import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomDropdown from '../components/CustomDropdown/CustomDropdown';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';

const API_BASE_URL = 'http://localhost:5001/api';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [biography, setBiography] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [postRegisterNavigate, setPostRegisterNavigate] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validaciones básicas
    if (!name.trim() || !username.trim() || !email.trim() || !birthday || !gender || !phone.trim() || !address.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, completa los campos obligatorios.');
      return;
    }

    // Email formato
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico con formato válido.');
      return;
    }

    // Teléfono: sólo dígitos y 10 caracteres (sin código de país)
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('El número de teléfono debe contener 10 dígitos.');
      return;
    }

    // Contraseña: mínimo 8 caracteres y deben coincidir
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_completo: name,
          username,
          fecha_nacimiento: birthday,
          genero: gender,
          email,
          telefono: phone.replace(/\D/g, ''),
          direccion: address,
          biografia: biography || undefined,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.mensaje || data?.error || 'Error al registrar. Verifica tus datos.');
        return;
      }

      setAlertMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      setAlertOpen(true);
      setPostRegisterNavigate(true);
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
          <h1>Crear cuenta</h1>
          <p>Completa tus datos para registrarte.</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-grid">
          <label>
            <span>Nombre completo</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="María González" />
          </label>

          <label>
            <span>Fecha de nacimiento</span>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </label>

          <label>
            <span>Género</span>
            <CustomDropdown
              options={[
                { value: '', label: 'Seleccionar' },
                { value: 'Femenino', label: 'Femenino' },
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Otro', label: 'Otro' },
              ]}
              value={gender}
              onChange={(v) => setGender(v)}
            />
          </label>

          <label>
            <span>Correo electrónico</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" />
          </label>

          <label>
            <span>Nombre de usuario</span>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario123" />
          </label>

          <label>
            <span>Número de teléfono</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5512345678 (10 dígitos)" />
          </label>

          <label className="full-width">
            <span>Dirección</span>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Av. Insurgentes 100, Col. Roma" />
          </label>

          <label className="full-width">
            <span>Biografía</span>
            <textarea value={biography} onChange={(e) => setBiography(e.target.value)} placeholder="Cuéntanos algo sobre ti" rows="4" />
          </label>

          {/* Avatar eliminado: no se solicita URL de avatar al usuario */}

          <label>
            <span>Contraseña</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
          </label>

          <label>
            <span>Confirmar contraseña</span>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite tu contraseña" />
          </label>
        </div>

        {error ? <p className="error-message">{error}</p> : null}

        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Crear cuenta'}</button>
      </form>

      <div className="auth-footer">
        <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </div>
      <ConfirmModal
        open={alertOpen}
        title="Aviso"
        message={alertMessage}
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={() => {
          setAlertOpen(false);
          if (postRegisterNavigate) {
            setPostRegisterNavigate(false);
            navigate('/login');
          }
        }}
        onCancel={() => setAlertOpen(false)}
      />
    </section>
  );
}

export default Register;
