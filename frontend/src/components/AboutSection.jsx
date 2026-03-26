import { useState, useEffect, useRef } from 'react';

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setTimeout(() => setEntered(true), 900); // Libera el estilo al terminar
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full grid grid-cols-1 md:grid-cols-2 font-brand">

      {/* --- COLUMNA DE TEXTO (Izquierda) --- */}
      <div className="bg-brand-brownDark text-brand-beige p-12 md:p-24 flex flex-col justify-center">

        {/* Título */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-8"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-60px)",
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
          }}
        >
          ¿Quiénes somos?
        </h2>

        {/* Párrafos de texto */}
        <div
          className="text-lg leading-relaxed space-y-6"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-60px)",
            transition: "opacity 700ms ease-out 350ms, transform 700ms ease-out 350ms",
          }}
        >
          <p>
            Somos un negocio familiar de bombones artesanales, que empezó en 2016 como una idea y hoy es una realidad. Nos encargamos de hacer sentir la magia del chocolate en cada mordida. Contamos con una amplia variedad de productos para todos los gustos. 
          </p>
          <p>
            Buscamos llegar a la casa de todos con nuestras recetas caseras artesanales.
          </p>
        </div>
      </div>

      {/* --- COLUMNA DE IMAGEN (Derecha) con Zoom Reveal --- */}
      <div className="h-full min-h-[400px] md:min-h-[500px] overflow-hidden bg-brand-beige group">
        <img
          src="/images/about-us-bombones.webp"
          alt="Bombones artesanales de Amargo y Dulce"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          style={entered ? undefined : {
            opacity: inView ? 1 : 0,
            transform: inView ? "scale(1)" : "scale(1.25)",
            transition: "opacity 900ms ease-out, transform 900ms ease-out",
          }}
        />
      </div>

    </section>
  );
}