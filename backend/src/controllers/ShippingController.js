import { sql } from "../config/db.js";

export const getActiveShipments = async (req, res) => {
  try {
    const shipments = await sql`
      SELECT *
      FROM vw_envios_activos
      ORDER BY fechaSalida DESC
    `;

    res.json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ error: "Failed to fetch shipments" });
  }
};

export const advanceShipmentStatus = async (req, res) => {
  const { idEnvio } = req.params;

  try {
    const shipment = await sql`
      SELECT estado
      FROM envio
      WHERE idEnvio = ${idEnvio}
    `;

    if (shipment.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    let nextStatus;

    switch (shipment[0].estado) {
      case "preparado":
        nextStatus = "en proceso";
        break;
      case "en proceso":
        nextStatus = "recibido";
        break;
      default:
        return res.status(400).json({
          error: "Shipment already completed"
        });
    }

    await sql`
      UPDATE envio
      SET estado = ${nextStatus}
      WHERE idEnvio = ${idEnvio}
    `;

    res.json({
      message: "Shipment status updated",
      newStatus: nextStatus
    });

  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ error: "Failed to update shipment" });
  }
};
