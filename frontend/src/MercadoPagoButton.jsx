import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

const MercadoPagoButton = ({ idFactura }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const createPreference = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/payments/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ idFactura })
          }
        );

        const data = await res.json();
        setPreferenceId(data.preferenceId);
      } catch (error) {
        alert("Error al conectar con el servidor");
        console.error(error);
      }
    };

    createPreference();
  }, [idFactura]);

  return (
    <div>
      {preferenceId && (
        <Wallet initialization={{ preferenceId }} />
      )}
    </div>
  );
};

export default MercadoPagoButton;
