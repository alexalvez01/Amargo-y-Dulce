import cron from "node-cron";
import { sql } from "../config/db.js";

export const deleteExpiredInvoices = async () => {
  try {
    console.log("Buscando y eliminando facturas sin pago de hace +24hs...");

    //Eliminamos las lineas de factura para que se reponga el stock
    const eliminatedLines = await sql`
      DELETE FROM lineafactura
      WHERE idFacturaFK IN (
        SELECT f.idFactura
        FROM factura f
        LEFT JOIN pago p ON f.idFactura = p.idFacturaFK
        WHERE p.idPago IS NULL
          AND f.fechaCreacion < NOW() - INTERVAL '24 hours'
      )
      RETURNING idFacturaFK;
    `;

    if (eliminatedLines.length === 0) {
      console.log("No hay facturas vencidas para procesar.");
      return;
    }

    
    await sql`
      DELETE FROM factura
      WHERE idFactura NOT IN (SELECT idFacturaFK FROM lineafactura)
        AND idFactura NOT IN (SELECT idFacturaFK FROM pago);
    `;

    console.log(`[CRON] Limpieza completada. Stock repuesto automáticamente por la base de datos.`);

  } catch (error) {
    console.error("[CRON] Error al eliminar facturas vencidas:", error);
  }
};

export const initCronJobs = () => {
  // Se ejecuta en el minuto 0 de cada hora
  console.log("Se ejecuta el cron para reponer stock");
  cron.schedule("0 * * * *", () => {
    deleteExpiredInvoices();
  });
};
