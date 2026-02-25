import { Facebook, Instagram, Twitter, Phone } from "lucide-react";

export default function Footer() {
  return (

    <footer id="footer" className="w-full bg-brand-beige text-brand-brown py-16 font-brand">

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

        {/* --- SECCIÓN DE REDES SOCIALES --- */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Redes sociales:</h3>
          <div className="flex gap-4">
            <Facebook className="w-6 h-6 cursor-pointer hover:text-brand-brownDark transition-colors" />
            <Instagram className="w-6 h-6 cursor-pointer hover:text-brand-brownDark transition-colors" />
            <Twitter className="w-6 h-6 cursor-pointer hover:text-brand-brownDark transition-colors" />
          </div>
        </div>

        {/* --- SECCIÓN DE DIRECCIÓN --- */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Encontranos en:</h3>
          <p className="text-sm font-medium">San Martín 689 -</p>
          <p className="text-sm font-medium">Tigre - Buenos Aires - Argentina</p>
        </div>
        {/* --- SECCIÓN DE CONTACTO --- */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Contactanos en:</h3>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span className="text-sm font-medium">(+54) 31431 12312</span>
          </div>
        </div>

      </div>

      <div className="text-center mt-12 text-xs font-semibold opacity-80">
        Todos los derechos reservados
      </div>
    </footer>
  );
}