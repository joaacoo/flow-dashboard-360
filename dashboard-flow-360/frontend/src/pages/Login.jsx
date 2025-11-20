import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email) {
      setError('Cargue los datos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Usuario o contraseña incorrectos');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-body">
      <center><div className="error_color"></div></center>

      <div className="box2 zoom padding" id="idZoom">
        <h1 id="logintoregister">
          <b>
            <span style={{ color: '#3091c6' }}>FLOW </span>
            <span style={{ color: '#b7b7bf' }}>360°</span>
          </b>
        </h1>

        {loading ? (
          <center id="loader">
            <img
              width="150"
              height="150"
              src="https://crmflow.grupotesys.com.ar/tickets/plugin/imagenes/Preloader_2.gif"
              alt="Cargando..."
            />
          </center>
        ) : (
          <>
            <div className="group primero">
              <input
                className="inputMaterial"
                type="text"
                name="user"
                id="user"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="off"
                required
              />
              <span className="highlight"></span>
              <span className="bar"></span>
              <label>Email</label>
            </div>

            <div className="group primero">
              <input
                className="inputMaterial"
                type="password"
                name="pass"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="new-password"
                required
              />
              <span className="highlight"></span>
              <span className="bar"></span>
              <label id="contra">Contraseña</label>
            </div>

            <button
              className="boton-login"
              id="buttonlogintoregister"
              onClick={handleLogin}
            >
              Login
            </button>

            {error && (
              <div style={{ color: 'red', paddingLeft: '37px' }} id="divError" className="error">
                {error}
              </div>
            )}

            <br />

            <div className="group primero">
              <a
                className="boton-login text-left"
                href="#"
                style={{ marginLeft: '0px' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/forgot-password');
                }}
              >
                ¿Olvidaste la contraseña?
              </a>
              <a
                className="boton-login text-right"
                href="#"
                style={{ marginLeft: '65px' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                Registrarse
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
