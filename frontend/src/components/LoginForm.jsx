import React from 'react';
import { Link } from 'react-router-dom';
// Asegurate de tener el componente GoogleLoginButton si ya lo tenías, 
// o usaremos el botón hardcodeado por ahora para que se vea igual al diseño.

const LoginForm = () => {
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
      
      {/* 1. ENCUEBZADO */}
      <div className="mb-8">
        <h2 className="text-brand-brown text-lg font-medium">Bienvenido de vuelta!</h2>
        <h1 className="text-4xl font-bold text-black mt-1">Iniciar Sesión</h1>
      </div>

      <form className="space-y-5">
        
        {/* 2. INPUT: EMAIL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-600 ml-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="test1@gmail.com"
            className="w-full bg-brand-beige px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown/50"
          />
        </div>

        {/* 3. INPUT: CONTRASEÑA */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-600 ml-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            placeholder="**************"
            className="w-full bg-brand-beige px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown/50"
          />
          
          {/* Link Olvidaste contraseña */}
          <div className="text-right mt-1">
            <a href="#" className="text-xs text-gray-400 hover:text-brand-brown transition-colors">
              Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        {/* 4. BOTÓN GOOGLE */}
        <button 
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-full mt-4 hover:bg-gray-50 transition"
        >
            <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium text-sm">Continuar con Google</span>
        </button>

        {/* 5. BOTÓN PRINCIPAL */}
        <button
          type="submit"
          className="w-full bg-brand-brown text-white font-bold py-3 rounded-full hover:bg-[#553C30] transition shadow-md uppercase text-sm tracking-wide"
        >
          INICIAR SESION
        </button>

      </form>

      {/* 6. FOOTER REGISTRO */}
      <div className="mt-6 text-center text-sm text-gray-400">
        No tenés cuenta?{' '}
        <Link to="/registro" className="text-brand-brown font-bold hover:underline">
          Registrate
        </Link>
      </div>
      
    </div>
  );
};

export default LoginForm;