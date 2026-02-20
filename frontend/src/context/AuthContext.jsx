// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, googleLoginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

// Hook para usar el contexto más fácil
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]); 

  //FUNCION LOGIN CON GOOGLE
  const signinGoogle = async (credentialResponse) => {
    try {
      const res = await googleLoginRequest(credentialResponse.credential);

      setUser(res.data.user); // Guardamos el usuario
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
      console.log(res.data);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token); // Guardamos token
    } catch (error) {
      console.log(error.response);
      setErrors([error.response.data.error || "Error al registrarse"]);
    }
  };

  // --- FUNCIÓN DE LOGIN ---
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
        console.log(error);
        if (Array.isArray(error.response.data)) {
            return setErrors(error.response.data);
        }
        setErrors([error.response.data.error || "Error al iniciar sesión"]);
    }
  };

  // --- VERIFICAR SI HAY UNA SESIÓN ACTIVA AL RECARGAR LA APP ---
  const [loading, setLoading] = useState(true); // Ayuda a que no parpadee la pantalla
  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        
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
  }, []);// El [] vacío asegura que esto solo corra una vez al cargar la app


  // --- FUNCIÓN DE LOGOUT --
  const logout = () => {
    Cookies.remove("token");
    console.log("Token eliminado del navegador");
    setUser(null);
    setIsAuthenticated(false);
    console.log("Estado de autenticación actualizado: user=null, isAuthenticated=false");
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
      logout,
      signinGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};