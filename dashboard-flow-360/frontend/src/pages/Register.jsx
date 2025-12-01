import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        llave: '',
        password: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    // Validar contraseña en tiempo real
    useEffect(() => {
        if (formData.password || formData.password2) {
            const validationError = validatePassword(formData.password);
            setPasswordError(validationError);
        }
    }, [formData.password, formData.password2]);

    const validatePassword = (pswd) => {
        let error = '';
        if (pswd.length < 6) {
            error += 'Debería tener mínimo 6 caracteres<br>';
        }
        if (!pswd.match(/[A-z]/)) {
            error += 'Al menos debería tener una Letra<br>';
        }
        if (!pswd.match(/[A-Z]/)) {
            error += 'Al menos debería tener una Letra en mayúscula<br>';
        }
        if (!pswd.match(/\d/)) {
            error += 'Al menos debería tener un número<br>';
        }
        return error;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleRegister = async (e) => {
        if (e) e.preventDefault();

        // Validaciones
        if (!formData.nombre || !formData.email || !formData.llave || !formData.password || !formData.password2) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (passwordError) {
            setError('La contraseña no cumple con los requisitos');
            return;
        }

        if (formData.password !== formData.password2) {
            setError('Las contraseñas ingresadas no coinciden');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:4012/api/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                llave: formData.llave,
                password: formData.password
            });

            if (response.data) {
                alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
                navigate('/login');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Error al registrar usuario');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
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
                                name="llave"
                                id="llave"
                                value={formData.llave}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Llave</label>
                        </div>

                        <div className="group primero">
                            <input
                                className="inputMaterial"
                                type="text"
                                name="nombre"
                                id="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Nombre</label>
                        </div>

                        <div className="group primero">
                            <input
                                className="inputMaterial"
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
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
                                name="password"
                                id="pass"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label id="contra">Contraseña</label>
                        </div>

                        <div className="group primero">
                            <input
                                className="inputMaterial"
                                type="password"
                                name="password2"
                                id="pass2"
                                value={formData.password2}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required
                            />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label id="contra">Confirmar Contraseña</label>
                        </div>

                        <button
                            className="boton-login"
                            id="buttonlogintoregister"
                            onClick={handleRegister}
                        >
                            Registrarme
                        </button>

                        {(error || passwordError) && (
                            <div
                                style={{ color: 'red', paddingLeft: '37px' }}
                                id="divError"
                                className="error"
                                dangerouslySetInnerHTML={{ __html: passwordError || error }}
                            />
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
                                ¿Ya tienes cuenta? Inicia sesión
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
