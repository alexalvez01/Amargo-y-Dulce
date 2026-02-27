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

export const getLatestOrderDetail = async (req, res) => {
  const userId = req.user.userId;

  try {
    const factura = await sql`
      SELECT
        f.idFactura,
        f.fechaCreacion,
        f.total
      FROM factura f
      WHERE f.idUsuarioFK = ${userId}
      ORDER BY f.fechaCreacion DESC, f.idFactura DESC
      LIMIT 1
    `;

    if (factura.length === 0) {
      return res.status(404).json({ error: "No hay pedidos confirmados." });
    }

    const idFactura = factura[0].idfactura;

    const productos = await sql`
      SELECT
        lf.idProductoFK,
        p.nombre,
        p.imagen,
        p."tamaño" AS tamano,
        lf.cantidad,
        lf.precioUnitario,
        lf.subtotalProducto,
        lf.valorDescuento
      FROM lineafactura lf
      JOIN producto p ON p.idProducto = lf.idProductoFK
      WHERE lf.idFacturaFK = ${idFactura}
      ORDER BY lf.idProductoFK
    `;

    const direccion = await sql`
      SELECT
        d.idDireccion,
        d.calle,
        d.numero,
        c.idCiudad,
        c.nombreCiudad,
        c.provincia,
        c.codigoPostal,
        c.pais
      FROM direccion d
      JOIN ciudad c ON c.idCiudad = d.idCiudadFK
      WHERE d.idUsuarioFK = ${userId}
      ORDER BY d.idDireccion DESC
      LIMIT 1
    `;

    res.json({
      factura: factura[0],
      productos,
      direccion: direccion[0] || null
    });
  } catch (error) {
    console.error("Error fetching latest order detail:", error);
    res.status(500).json({ error: "Failed to fetch latest order detail" });
  }
};

export const saveOrderDetailData = async (req, res) => {
  const userId = req.user.userId;
  const {
    calle,
    numero,
    nombreCiudad,
    provincia,
    codigoPostal,
    pais = "Argentina"
  } = req.body;

  const calleRaw = String(calle || "").trim().replace(/\s+/g, " ");
  const numeroFromCalle = calleRaw.match(/(\d+)\s*$/)?.[1];
  const numeroDetectado = Number(numero ?? numeroFromCalle);
  // Avoid accumulating house numbers in "calle" on every save/load cycle.
  const calleLimpia = numeroFromCalle
    ? calleRaw.replace(/\s*\d+(?:\s+\d+)*\s*$/, "").trim()
    : calleRaw;

  if (!calleLimpia || !numeroDetectado || !nombreCiudad || !provincia || !codigoPostal) {
    return res.status(400).json({ error: "Faltan datos obligatorios de direccion." });
  }

  try {
    const ciudadExistente = await sql`
      SELECT idCiudad
      FROM ciudad
      WHERE LOWER(nombreCiudad) = LOWER(${nombreCiudad})
        AND LOWER(provincia) = LOWER(${provincia})
        AND codigoPostal = ${codigoPostal}
        AND LOWER(pais) = LOWER(${pais})
      LIMIT 1
    `;

    let idCiudad;
    if (ciudadExistente.length > 0) {
      idCiudad = ciudadExistente[0].idciudad;
    } else {
      const nuevaCiudad = await sql`
        INSERT INTO ciudad (idCiudad, nombreCiudad, provincia, codigoPostal, pais)
        SELECT COALESCE(MAX(idCiudad), 0) + 1, ${nombreCiudad}, ${provincia}, ${codigoPostal}, ${pais}
        FROM ciudad
        RETURNING idCiudad
      `;
      idCiudad = nuevaCiudad[0].idciudad;
    }

    const direccionExistente = await sql`
      SELECT idDireccion
      FROM direccion
      WHERE idUsuarioFK = ${userId}
      ORDER BY idDireccion DESC
      LIMIT 1
    `;

    let idDireccion;
    if (direccionExistente.length > 0) {
      idDireccion = direccionExistente[0].iddireccion;
      await sql`
        UPDATE direccion
        SET
          idCiudadFK = ${idCiudad},
          calle = ${calleLimpia},
          numero = ${numeroDetectado}
        WHERE idDireccion = ${idDireccion}
      `;
    } else {
      const nuevaDireccion = await sql`
        INSERT INTO direccion (idDireccion, idUsuarioFK, idCiudadFK, calle, numero)
        SELECT COALESCE(MAX(idDireccion), 0) + 1, ${userId}, ${idCiudad}, ${calleLimpia}, ${numeroDetectado}
        FROM direccion
        RETURNING idDireccion
      `;
      idDireccion = nuevaDireccion[0].iddireccion;
    }

    res.json({
      message: "Datos de envio guardados correctamente",
      direccion: {
        idDireccion,
        calle: calleLimpia,
        numero: numeroDetectado,
        idCiudad,
        nombreCiudad,
        provincia,
        codigoPostal,
        pais
      }
    });
  } catch (error) {
    console.error("Error saving order detail data:", error);
    res.status(500).json({ error: "No se pudieron guardar los datos de envio" });
  }
};
