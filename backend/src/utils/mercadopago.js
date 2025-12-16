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
  const preference = new Preference(client);

  const response = await preference.create({
    body: {
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
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending"
      }
      
    }
  });

  return response.id;
};


