// src/controllers/PaymentController.js
import { sql } from "../config/db.js";
import { createMpPreference } from "../utils/mercadopago.js";


// Crear preferencia MP
export const createPaymentPreference = async (req, res) => {
  const { idFactura } = req.body;

  try {
    const factura = await sql`
      SELECT f.idFactura, f.total, u.mail
      FROM factura f
      JOIN usuario u ON f.idUsuarioFK = u.idUsuario
      WHERE f.idFactura = ${idFactura}
    `;

    if (factura.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const preferenceId = await createMpPreference({
      idFactura: factura[0].idfactura,
      total: factura[0].total,
      email: factura[0].mail
    });

    res.json({ preferenceId });

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
    const exists = await sql`
      SELECT 1
      FROM pago
      WHERE idFacturaFK = ${idFactura}
    `;

    if (exists.length > 0) {
      return res.status(400).json({ error: "El pago ya fue registrado" });
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

    res.status(201).json({
      message: "Pago confirmado correctamente",
      idPago: result[0].idpago,
      comprobante: result[0].comprobante
    });

  } catch (error) {
    console.error("Error confirmPayment:", error);
    res.status(500).json({ error: "Error confirmando el pago" });
  }
};