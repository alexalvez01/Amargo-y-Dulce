import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Step({ label, state, number }) {
  const done = state === "done";
  const active = state === "active";

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
            done ? "bg-[#3f8f54] text-white" : active ? "bg-[#6b4c3a] text-white" : "bg-[#a39b95] text-white"
          }`}
        >
          {done ? <Check size={14} /> : number}
        </div>
        <span
          className={`text-xs md:text-sm font-semibold ${
            done ? "text-[#3f8f54]" : active ? "text-[#6b4c3a]" : "text-[#9d9691]"
          }`}
        >
          {label}
        </span>
      </div>
      <div className={`h-0.5 ${done ? "bg-[#62ad75]" : active ? "bg-[#6b4c3a]" : "bg-transparent"}`} />
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-[#f7f2ec] flex flex-col font-brand">
      <Navbar />

      <main className="min-h-screen">
      <div className="max-w-6xl min-h-screen mx-auto w-full px-4 mt-20 md:mt-30 mb-16">
        <h1 className="text-4xl md:text-5xl text-brand-brownDark font-semibold mb-7 text-center">Detalles de Pedido</h1>

        <div className="flex gap-5 max-w-3xl mx-auto mb-16">
          <Step number={1} label="Carrito" state="done" />
          <Step number={2} label="Detalles de pago" state="done" />
          <Step number={3} label="Estado de Pedido" state="active" />
        </div>

        <div className="max-w-md mt-40 mx-auto bg-white rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-3xl font-semibold text-brand-brownDark mb-3">Pago Rechazado</h2>
          <p className="text-[#7a7a7a] text-sm mb-6">
            Lo sentimos su pago ha sido rechazado, por lo tanto no pudimos completar correctamente su pedido.
          </p>

          <div className="space-y-3">
            <Link
              to="/order-detail"
              className="inline-block w-full bg-[#6b4c3a] text-white font-semibold py-2.5 rounded-md hover:bg-[#543b2d] transition-colors"
            >
              Intentar nuevamente
            </Link>
            <Link
              to="/shop"
              className="inline-block w-full bg-[#6b4c3a] text-white font-semibold py-2.5 rounded-md hover:bg-[#543b2d] transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>

      </main>
      
      <Footer />
    </div>
  );
}
