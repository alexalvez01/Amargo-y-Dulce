// src/controllers/PaymentController.js
import { sql } from "../config/db.js";
import { createMpPreference } from "../utils/mercadopago.js";

const registerPaymentByFactura = async (idFactura) => {
  const exists = await sql`
    SELECT 1
    FROM pago
    WHERE idFacturaFK = ${idFactura}
  `;

  if (exists.length > 0) {
    return { alreadyRegistered: true };
  }

  const result = await sql`
    WITH nuevo_pago AS (
      INSERT INTO pago (
        idFacturaFK,
        fechaPago,
        monto,
        estado,
        comprobante
      )
      VALUES (
        ${idFactura},
        NOW(),
        (SELECT total FROM factura WHERE idFactura = ${idFactura}),
        'finalizado',
        'TEMP'
      )
      RETURNING idPago
    )
    SELECT 
      p.idPago,
      fn_generar_comprobante(p.idPago) AS comprobante
    FROM nuevo_pago p
  `;

  return {
    alreadyRegistered: false,
    idPago: result[0].idpago,
    comprobante: result[0].comprobante
  };
};


// Crear preferencia MP
export const createPaymentPreference = async (req, res) => {
  const userId = req.user.userId;
  const { idFactura } = req.body;

  try {
    const factura = await sql`
      SELECT f.idFactura, f.total, u.mail
      FROM factura f
      JOIN usuario u ON f.idUsuarioFK = u.idUsuario
      WHERE f.idFactura = ${idFactura}
        AND f.idUsuarioFK = ${userId}
    `;

    if (factura.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const preference = await createMpPreference({
      idFactura: factura[0].idfactura,
      total: factura[0].total,
      email: factura[0].mail
    });

    res.json({
      preferenceId: preference.id,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando pago" });
  }
};

// Confirmar pago 
export const confirmPayment = async (req, res) => {
  const { idFactura } = req.body;

  if (!idFactura) {
    return res.status(400).json({ error: "idFactura es obligatorio" });
  }

  try {
    const payment = await registerPaymentByFactura(idFactura);
    if (payment.alreadyRegistered) {
      return res.status(400).json({ error: "El pago ya fue registrado" });
    }

    res.status(201).json({
      message: "Pago confirmado correctamente",
      idPago: payment.idPago,
      comprobante: payment.comprobante
    });

  } catch (error) {
    console.error("Error confirmPayment:", error);
    res.status(500).json({ error: "Error confirmando el pago" });
  }
};

const redirectToFrontend = (res, path, query) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
  const qs = new URLSearchParams(query).toString();
  const target = `${frontendUrl}${path}${qs ? `?${qs}` : ""}`;
  return res.redirect(target);
};

export const handlePaymentSuccessReturn = async (req, res) => {
  const idFactura = Number(req.query.external_reference || req.query.idFactura);

  if (idFactura) {
    try {
      await registerPaymentByFactura(idFactura);
    } catch (error) {
      console.error("Error confirming payment on success return:", error);
    }
  }

  return redirectToFrontend(res, "/payment/success", req.query);
};

export const handlePaymentPendingReturn = async (req, res) =>
  redirectToFrontend(res, "/payment/pending", req.query);

export const handlePaymentFailureReturn = async (req, res) =>
  redirectToFrontend(res, "/payment/failure", req.query);
