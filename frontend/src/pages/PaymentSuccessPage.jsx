import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { confirmPaymentRequest } from "../api/payments";

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
          className={`text-sm font-semibold ${
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

export default function PaymentSuccessPage() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [confirming, setConfirming] = useState(false);
  const confirmedRef = useRef(false);

  useEffect(() => {
    const idFactura = params.get("external_reference") || params.get("idFactura");
    if (!idFactura || confirmedRef.current) return;

    const confirm = async () => {
      try {
        confirmedRef.current = true;
        setConfirming(true);
        await confirmPaymentRequest(Number(idFactura));
      } catch (error) {
        const msg = error?.response?.data?.error;
        if (msg !== "El pago ya fue registrado") {
          toast.error("No se pudo registrar el pago automaticamente");
        }
      } finally {
        setConfirming(false);
      }
    };

    confirm();
  }, [params]);

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex flex-col font-brand">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-4 mt-10 md:mt-20 mb-16">
        <h1 className="text-4xl md:text-5xl text-brand-brownDark font-semibold mb-7 text-center">Detalles de Pedido</h1>

        <div className="flex gap-5 max-w-3xl mx-auto mb-16">
          <Step number={1} label="Carrito" state="done" />
          <Step number={2} label="Detalles de pago" state="done" />
          <Step number={3} label="Estado de pedido" state="active" />
        </div>

        <div className="max-w-md mx-auto bg-[#f4f4f4] rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-3xl font-semibold text-brand-brownDark mb-3">Pago finalizado</h2>
          <p className="text-[#7a7a7a] text-sm mb-6">
            Su compra ha sido completada exitosamente, puede seguir viendo el catalogo si lo desea.
          </p>
          {confirming && <p className="text-xs text-gray-500 mb-4">Registrando pago...</p>}

          <Link
            to="/shop"
            className="inline-block w-full bg-[#6b4c3a] text-white font-semibold py-2.5 rounded-md hover:bg-[#543b2d] transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
