// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth";

export const AuthContext = createContext();

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
  const [errors, setErrors] = useState([]); // Para manejar errores globales

  // --- FUNCIÓN DE REGISTRO ---
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data.user); // Asumiendo que el back devuelve { user: ... }
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
      user,
      isAuthenticated,
      errors
    }}>
      {children}
    </AuthContext.Provider>
  );
};