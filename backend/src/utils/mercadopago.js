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
  const frontendUrl = (process.env.FRONTEND_URL)
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
      success: `${frontendUrl}/payment/success?idFactura=${idFactura}`,
      failure: `${frontendUrl}/payment/failure?idFactura=${idFactura}`,
      pending: `${frontendUrl}/payment/pending?idFactura=${idFactura}`
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
