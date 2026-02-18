import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const { signup, signinGoogle, isAuthenticated, errors: registerErrors } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '', password: '', confirmPassword: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- EFECTS ---

  // A. Si se registra/loguea exitosamente, vamos al Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // B. Si el contexto devuelve errores del backend, los mostramos
  useEffect(() => {
    if (registerErrors.length > 0) {
      setError(registerErrors[0]);
      setLoading(false);
    }
  }, [registerErrors]);


  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false); 
      return;
    }

    // Llamamos a la función del Contexto
    // IMPORTANTE: Mapeamos los nombres para que coincidan con tu Backend
    await signup({
        nombre: formData.nombre,
        apellido: formData.apellido,
        mail: formData.email,        
        contraseña: formData.password,
        telefono: formData.telefono
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    if (signinGoogle) {
        await signinGoogle({
            credential: credentialResponse.credential,
        });
    } else {
        console.error("Falta signinGoogle en AuthContext");
    }
  };

  // --- ESTILOS ---
  const inputStyles = "w-full bg-brand-beige px-3 py-2 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown/50 transition-all font-brand";
  const labelStyles = "text-xs font-bold text-gray-600 ml-1 mb-0.5 block font-brand";

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl lg:ml-24 lg:mr-12 mx-auto border border-gray-100 relative z-20 font-brand">
      
      {/* HEADER */}
      <div className="mb-4 text-center l:text-left">
        <h2 className="text-brand-brown text-lg font-bold font-brand">Bienvenido!</h2>
        <h1 className="text-3xl font-extrabold text-black tracking-tight leading-none font-brand">Registrate</h1>
      </div>

      {/* ERROR */}
      {error && <div className="mb-2 bg-red-50 text-red-700 p-2 text-xs rounded border-l-4 border-red-500 font-brand">{error}</div>}

      <form className="space-y-2" onSubmit={handleSubmit}>
        
        {/* NOMBRE Y APELLIDO */}
        
        <div>
            <label className={labelStyles}>Nombre *</label>
            <input type="text" name="nombre" placeholder="Juan" required 
                value={formData.nombre} onChange={handleChange} className={inputStyles} />
        </div>
        <div>
            <label className={labelStyles}>Apellido *</label>
            <input type="text" name="apellido" placeholder="Pérez" required 
                value={formData.apellido} onChange={handleChange} className={inputStyles} />
        </div>

        {/* EMAIL */}
        <div>
          <label className={labelStyles}>Email *</label>
          <input type="email" name="email" placeholder="hola@ejemplo.com" required 
            value={formData.email} onChange={handleChange} className={inputStyles} />
        </div>

        {/* TELÉFONO */}
        <div>
          <label className={labelStyles}>Teléfono *</label>
          <input type="tel" name="telefono" placeholder="3442 123456" required 
            value={formData.telefono} onChange={handleChange} className={inputStyles} />
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label className={labelStyles}>Contraseña *</label>
          <input type="password" name="password" placeholder="••••••••" required 
            value={formData.password} onChange={handleChange} className={inputStyles} />
        </div>

        {/* CONFIRMAR */}
        <div>
          <label className={labelStyles}>Confirmar contraseña *</label>
          <input type="password" name="confirmPassword" placeholder="••••••••" required 
            value={formData.confirmPassword} onChange={handleChange} className={inputStyles} />
        </div>

        {/* BOTONES */}
        <div className="pt-4 flex flex-col items-center space-y-3">
            
            <div className="w-full flex justify-center h-10 font-brand">
                 <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Falló Google')}
                    theme="outline" 
                    shape="pill"
                    size="auto"
                    width="280"
                    text="continue_with"
                    locale="es"
                />
            </div>

            <button
            type="submit"
            disabled={loading}
            className={`pl-10 pr-10 bg-brand-brown text-white font-bold py-2.5 rounded-full shadow-md uppercase text-xs tracking-wide transition-all font-brand
                ${loading ? 'opacity-70' : 'hover:bg-[#553C30]'}`}
            >
            {loading ? '...' : 'REGISTRARSE'}
            </button>
        </div>

      </form>

      {/* FOOTER */}
      <div className="mt-3 text-center text-xs text-gray-400 font-brand">
        Ya tenés cuenta?{' '}
        <Link to="/login" className="text-brand-brown font-bold hover:underline font-brand">
          Inicia Sesión
        </Link>
      </div>
      
    </div>
  );
};

export default RegisterForm;