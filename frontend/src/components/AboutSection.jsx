import React from 'react';

export default function AboutSection() {
  return (
    // Sección principal de ancho completo que usa CSS Grid
    // En móvil es 1 columna, en escritorio (md) son 2 columnas iguales.
    <section className="w-full grid grid-cols-1 md:grid-cols-2 font-brand">
      
      {/* --- COLUMNA DE TEXTO (Izquierda) --- */}
      {/* Usamos el color marrón oscuro de fondo y texto beige claro */}
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
      {/* Definimos una altura mínima para que siempre se vea bien */}
      <div className="h-full min-h-[400px] md:min-h-[500px]">
        <img 
          src="/images/about-us-bombones.webp" // <--- ¡REEMPLAZA CON EL NOMBRE REAL DE TU IMAGEN!
          alt="Bombones artesanales de Amargo y Dulce" 
          className="w-full h-full object-cover" // 'object-cover' hace que la imagen llene el espacio sin deformarse
        />
      </div>
      
    </section>
  );
}