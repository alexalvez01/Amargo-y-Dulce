import { useState, useEffect, useRef } from "react";
import { Send, CreditCard, MessageCircleQuestion } from "lucide-react";

export default function ServiceSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Send size={50} strokeWidth={1.5} className="mb-6 text-[#5a3a29]" />,
      title: "Envíos a todo el país",
      text: "Llegamos a todo el país, tenemos múltiples modos de envío!",
    },
    {
      icon: <CreditCard size={50} strokeWidth={1.5} className="mb-6 text-[#5a3a29]" />,
      title: "Formas de pago",
      text: "Por el momento solo contamos con pagos mediante Mercado Pago",
    },
    {
      icon: <MessageCircleQuestion size={50} strokeWidth={1.5} className="mb-6 text-[#5a3a29]" />,
      title: "Contactanos",
      text: "No dudes en contactarnos ante cualquier duda via Whatsapp",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-brand-beige py-20 font-brand text-[#5a3a29]">
      <div className="max-w-6xl mx-auto px-4">

        {/* Título de la sección */}
        <h2
          className="text-2xl md:text-3xl font-extrabold text-center mb-16 tracking-wide uppercase"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Nuestro Servicio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 600ms ease-out, transform 600ms ease-out",
                transitionDelay: `${300 + index * 200}ms`,
              }}
            >
              {service.icon}
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-[#7a5c4d] leading-relaxed max-w-[260px] text-sm md:text-base">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}