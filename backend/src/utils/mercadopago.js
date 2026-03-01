import { MercadoPagoConfig, Preference } from "mercadopago";

// Cliente MP
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Crear preferencia de pago
export const createMpPreference = async ({
  idFactura,
  total,
  email
}) => {
  const frontendUrl = process.env.FRONTEND_URL;
  const backendUrl = process.env.BACKEND_URL;

  if (!frontendUrl) {
    throw new Error("FRONTEND_URL no esta definida en .env");
  }

  const isLocalFrontend =
    frontendUrl.includes("localhost") || frontendUrl.includes("127.0.0.1");

  const preference = new Preference(client);

  const preferenceBody = {
    items: [
      {
        title: `Pedido #${idFactura}`,
        quantity: 1,
        unit_price: Number(total),
        currency_id: "ARS"
      }
    ],
    payer: {
      email
    },
    external_reference: String(idFactura),
    back_urls: {
      success: `${frontendUrl}/payment/success`,
      failure: `${frontendUrl}/payment/failure`,
      pending: `${frontendUrl}/payment/pending`
    },
    binary_mode: true,
    notification_url: backendUrl
      ? `${backendUrl}/api/payments/webhook`
      : undefined
  };

  if (!isLocalFrontend) {
    preferenceBody.auto_return = "approved";
  }

  const response = await preference.create({ body: preferenceBody });

  return {
    id: response.id,
    initPoint: response.init_point,
    sandboxInitPoint: response.sandbox_init_point
  };
};
