
import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, googleLoginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

// Creación del contexto de autenticación
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Permite a los componentes hijos acceder a los datos del usuario, 
 * funciones de login, logout, registro, estado de autenticación y errores.
 * @returns {Object} El estado y métodos de AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

/**
 * Proveedor del contexto de Autenticación.
 * 
 * Mantiene de manera global los datos del usuario logueado en la variable 'user',
 * rastrea la autenticación en 'isAuthenticated', almacena los 'errors' que vengan
 * del backend durante los procesos de auth, y provee las funciones de interacción 
 * (login, signup, logout).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]); 

  // --- FUNCION LOGIN CON GOOGLE ---
  /**
   * Envía las credenciales devueltas por el botón de Google al backend para iniciar sesión.
   * Si es exitoso, actualiza el estado y guarda el token JWT en una cookie.
   * @param {Object} credentialResponse - Respuesta del componente de Google Login.
   */
  const signinGoogle = async (credentialResponse) => {
    try {
      const res = await googleLoginRequest(credentialResponse.credential);

      setUser(res.data.user); 
      setIsAuthenticated(true);
      if (res.data.token) {
      Cookies.set("token", res.data.token);
      }
    } catch (error) {
      console.error(error);
      setErrors(["Error al iniciar sesión con Google"]);
    }
  };


  // --- FUNCIÓN DE REGISTRO ---
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      Cookies.set("token", res.data.token);
    } catch (error) {
      console.log(error.response);
      setErrors([error.response.data.error || "Error al registrarse"]);
    }
  };

  // --- FUNCIÓN DE LOGIN ---
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data.user);
      setIsAuthenticated(true);
      Cookies.set("token", res.data.token);
    } catch (error) {
        console.log(error);
        if (Array.isArray(error.response.data)) {
            return setErrors(error.response.data);
        }
        setErrors([error.response.data.error || "Error al iniciar sesión"]);
    }
  };

  // --- VERIFICAR SI HAY UNA SESIÓN ACTIVA AL RECARGAR LA APP ---
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    async function checkLogin() {
      const token = Cookies.get("token");

      if (!token || token === "undefined") {
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
        Cookies.remove("token");
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        Cookies.remove("token");
      }
    }

    checkLogin();
  }, []);


  // --- FUNCIÓN DE LOGOUT --
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider value={{
      signup,
      signin,
      logout,
      user,
      isAuthenticated,
      errors,
      signinGoogle,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};