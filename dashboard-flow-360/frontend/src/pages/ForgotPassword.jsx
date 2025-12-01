import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        if (e) e.preventDefault();

        if (!email) {
            setError('Debe cargar el correo');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:4012/api/auth/forgot-password', {
                email: email
            });

            if (response.data) {
                alert('Se ha enviado un mail de confirmación a su casilla. Por favor, valide su cuenta para restablecer su contraseña.');
                navigate('/login');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Error al enviar el correo de recuperación');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleResetPassword();
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
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Email</label>
                        </div>

                        <button
                            className="boton-login"
                            id="buttonlogintoregister"
                            onClick={handleResetPassword}
                        >
                            Restablecer contraseña
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
                                    navigate('/login');
                                }}
                            >
                                Volver al login
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
