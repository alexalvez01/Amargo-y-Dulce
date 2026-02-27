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
  const backendUrl = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  const preference = new Preference(client);

  const preferenceBody = {
    items: [
      {
        title: `Pedido #${idFactura}`,
        quantity: 1,
        unit_price: Number(total)
      }
    ],
    payer: {
      email
    },
    external_reference: String(idFactura),
    back_urls: {
      success: `${backendUrl}/api/payments/return/success?idFactura=${idFactura}`,
      failure: `${backendUrl}/api/payments/return/failure?idFactura=${idFactura}`,
      pending: `${backendUrl}/api/payments/return/pending?idFactura=${idFactura}`
    }
  };

  preferenceBody.auto_return = "approved";

  let response;
  try {
    response = await preference.create({ body: preferenceBody });
  } catch (error) {
    if (error?.error === "invalid_auto_return") {
      delete preferenceBody.auto_return;
      response = await preference.create({ body: preferenceBody });
    } else {
      throw error;
    }
  }

  return {
    id: response.id,
    initPoint: response.init_point,
    sandboxInitPoint: response.sandbox_init_point
  };
};
