import { sql } from "../config/db.js";

export const getPurchaseHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    const history = await sql`
      SELECT
        idFactura,
        fecha_factura,
        total_factura,
        idProducto,
        nombre_producto,
        cantidad,
        precioUnitario,
        subtotalProducto
      FROM vw_historial_compras
      WHERE idUsuario = ${userId}
      ORDER BY fecha_factura DESC
    `;

    res.json(history);
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ error: "Failed to fetch purchase history" });
  }
};