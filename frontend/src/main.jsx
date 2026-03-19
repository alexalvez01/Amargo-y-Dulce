// Importaciones core de React y ReactDOM para el montaje de la aplicación
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Estilos globales de la aplicación
import './index.css'
// Componente raíz de la aplicación
import App from './App.jsx'
// Proveedor de autenticación de Google
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* GoogleOAuthProvider envuelve la app para habilitar el login con Google, usando el Client ID del entorno */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
