import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const navigate = useNavigate();
  // Nota: Agregué signinGoogle asumiendo que la crearás en el context
  const { signin, signinGoogle, isAuthenticated, errors: loginErrors } = useAuth();

  // STATE

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // EFFECTS (Para conectar el Context con la UI)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (loginErrors.length > 0) {
      setError(loginErrors[0]); 
      setLoading(false); 
    }
  }, [loginErrors]);

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
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true); // Opcional: mostrar loading mientras procesa google

    if (signinGoogle) {
        await signinGoogle({
            credential: credentialResponse.credential,
        });
    } else {
        console.error("Falta implementar signinGoogle en el AuthContext");
        setError("Error de configuración interna");
    }
  };


  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 font-brand">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-brand-brownLight font-brand text-lg font-medium">
          Bienvenido de vuelta!
        </h2>
        <h1 className="text-4xl font-bold font-brand text-black mt-1">
          Iniciar Sesión
        </h1>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
          {error}
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
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••••••"
            className="w-full bg-brand-beige px-4 py-3 rounded-lg font-brand text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-brand-brownLight"
          />

          <div className="text-right mt-1">
            <a
              href="#"
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