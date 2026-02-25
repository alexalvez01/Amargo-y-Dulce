import React from 'react';

export default function AboutSection() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 font-brand">
      
      {/* --- COLUMNA DE TEXTO (Izquierda) --- */}
      <div className="bg-brand-brownDark text-brand-beige p-12 md:p-24 flex flex-col justify-center">
        
        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          ¿Quiénes somos?
        </h2>
        
        {/* Párrafos de texto */}
        <div className="text-lg leading-relaxed space-y-6">
          <p>
            Somos un negocio familiar que empezó en 2016 de bombones artesanales el cual cuenta con encargos personalizados a todo el país en cualquier momento.
          </p>
          <p>
            Buscamos llegar a la casa de todos con nuestras recetas caseras artesanales.
          </p>
        </div>
      </div>

      {/* --- COLUMNA DE IMAGEN (Derecha) --- */}

      <div className="h-full min-h-[400px] md:min-h-[500px]">
        <img 
          src="/images/about-us-bombones.webp" 
          alt="Bombones artesanales de Amargo y Dulce" 
          className="w-full h-full object-cover" 
        />
      </div>
      
    </section>
  );
}