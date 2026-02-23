import { Send, CreditCard, MessageCircleQuestion } from "lucide-react";

export default function ServiceSection() {
  return (
    // Fondo color crema claro, similar al de tu diseño
    <section className="bg-brand-beige py-20 font-brand text-[#5a3a29]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Título de la sección */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-16 tracking-wide uppercase">
          Nuestro Servicio
        </h2>

        {/* Contenedor de las 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {/* Bloque 1: Envíos */}
          <div className="flex flex-col items-center">
            <Send size={50} strokeWidth={1.5} className="mb-6 text-[#5a3a29]" />
            <h3 className="text-xl font-bold mb-4">Envíos a todo el país</h3>
            <p className="text-[#7a5c4d] leading-relaxed max-w-[260px] text-sm md:text-base">
              Llegamos a todo el país, tenemos múltiples modos de envío!
            </p>
          </div>

          {/* Bloque 2: Formas de pago */}
          <div className="flex flex-col items-center">
            <CreditCard size={50} strokeWidth={1.5} className="mb-6 text-[#5a3a29]" />
            <h3 className="text-xl font-bold mb-4">Formas de pago</h3>
            <p className="text-[#7a5c4d] leading-relaxed max-w-[260px] text-sm md:text-base">
              Por el momento solo contamos con pagos mediante Mercado Pago
            </p>
          </div>

          {/* Bloque 3: Contacto */}
          <div className="flex flex-col items-center">
            <MessageCircleQuestion size={50} strokeWidth={1.5} className="mb-6 text-[#5a3a29]" />
            <h3 className="text-xl font-bold mb-4">Contactanos</h3>
            <p className="text-[#7a5c4d] leading-relaxed max-w-[260px] text-sm md:text-base">
              No dudes en contactarnos ante cualquier duda via Whatsapp
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}