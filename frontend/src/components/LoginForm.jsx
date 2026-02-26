import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { ChevronLeft } from 'lucide-react'
import Home from "../pages/Home";

const LoginForm = () => {
  const navigate = useNavigate();

  const { signin, signinGoogle, isAuthenticated, errors: loginErrors } = useAuth();

  // STATE

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // EFFECTS 

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const backendError = loginErrors[0] ?? null;

  // HANDLERS

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await signin({
      mail: formData.email,
      contraseña: formData.password
    });
    setLoading(false);
  };

    const handleGoogleSuccess = async (credentialResponse) => {
      setError(null);
      setLoading(true); 
      await signinGoogle(credentialResponse);
    };


  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 font-brand">
      <button
        type="button"
        className="absolute left-2 top-4 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-20 cursor-pointer "
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={28} />
        <span className="font-semibold text-lg">Volver</span>
      </button>

      {/* HEADER */}
      <div className="mb-6 text-left">
        <h2 className="text-brand-brownLight font-brand text-lg font-medium">
          Bienvenido de vuelta!
        </h2>
        <h3 className="text-4xl font-bold font-brand text-black mt-1">
          Iniciar Sesión
        </h3>
      </div>

      {/* ERROR MESSAGE */}
      {(error || backendError) && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
          {error || backendError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-brand text-gray-600 ml-1">
            Email
          </label>

          <input
            type="email"
            id="email"
            autoComplete="username"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@gmail.com"
            className="w-full bg-brand-beige px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-brand-brownLight"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-brand  text-gray-600 ml-1">
            Contraseña
          </label>

          <input
            type="password"
            id="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••••••"
            className="w-full bg-brand-beige px-4 py-3 rounded-lg font-brand text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-brand-brownLight"
          />

          <div className="text-right mt-1">
            <a
              href="/forgot-password"
              className="text-xs text-gray-400 font-brand hover:text-brand-brown transition-colors"
            >
              Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        {/* GOOGLE LOGIN */}
        <div className="w-full flex justify-center mt-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setError("Falló el inicio de sesión con Google")
            }
            theme="outline"
            shape="pill"
            size="large"
            width="380"
            text="continue_with"
            locale="es"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-brand-brown text-white font-bold font-brand py-3 rounded-full
                      transition shadow-md uppercase text-sm tracking-wide
                      ${
                        loading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-brand-brownDark"
                      }`}
        >
          {loading ? "Procesando..." : "INICIAR SESIÓN"}
        </button>

      </form>

      {/* FOOTER */}
      <div className="mt-6 text-center text-sm font-brand text-gray-400">
        No tenés cuenta?{" "}
        <Link
          to="/register"
          className="text-brand-brown font-bold font-brand hover:underline"
        >
          Registrate
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;