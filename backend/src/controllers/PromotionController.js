import { sql } from "../config/db.js";

/* --------------------------------------------------
   GET /api/promotions
   Obtener promociones activas con sus productos
-------------------------------------------------- */
export const getAllPromotions = async (req, res) => {
  try {
    const rows = await sql`
      SELECT 
        pr.idpromocion,
        pr.nombre,
        pr.descripcion,
        pr.valor,
        pr.fechainicio,
        pr.fechafin,
        pr.estado,
        p.idproducto,
        p.nombre AS nombreproducto,
        p.precio
      FROM promocion pr
      JOIN promocionproducto pp 
        ON pp.idpromocionfk = pr.idpromocion
      JOIN producto p 
        ON p.idproducto = pp.idproductofk
      WHERE CURRENT_DATE BETWEEN pr.fechainicio AND pr.fechafin
      ORDER BY pr.fechainicio ASC;
    `;

    // 🔥 Agrupar promociones
    const promotionsMap = {};

    rows.forEach(row => {
      if (!promotionsMap[row.idpromocion]) {
        promotionsMap[row.idpromocion] = {
          idpromocion: row.idpromocion,
          nombre: row.nombre,
          descripcion: row.descripcion,
          valor: row.valor,
          fechainicio: row.fechainicio,
          fechafin: row.fechafin,
          estado: row.estado,
          productos: []
        };
      }

      promotionsMap[row.idpromocion].productos.push({
        idproducto: row.idproducto,
        nombre: row.nombreproducto,
        precio: row.precio
      });
    });

    const promotions = Object.values(promotionsMap);

    return res.status(200).json(promotions);

  } catch (error) {
    console.error("Error getAllPromotions:", error);
    return res.status(500).json({ error: "Error al obtener promociones" });
  }
};

/* --------------------------------------------------
   GET /api/promotions/:id
-------------------------------------------------- */
export const getPromotionById = async (req, res) => {
  const { id } = req.params;

  try {
    const promotion = await sql`
      SELECT *
      FROM promocion
      WHERE idpromocion = ${id};
    `;

    if (promotion.length === 0) {
      return res.status(404).json({ error: "Promoción no encontrada" });
    }

    const products = await sql`
      SELECT p.*
      FROM promocionproducto pp
      JOIN producto p ON p.idproducto = pp.idproductofk
      WHERE pp.idpromocionfk = ${id};
    `;

    return res.status(200).json({
      promocion: promotion[0],
      productos: products
    });
  } catch (error) {
    console.error("Error getPromotionById:", error);
    return res.status(500).json({ error: "Error al obtener promoción" });
  }
};

/* --------------------------------------------------
  POST /api/promotions 
  Crea promoción, asocia MULTIPLES productos y sobreescribe si es necesario (ADMIN)
-------------------------------------------------- */
export const createPromotion = async (req, res) => {
  const { nombre, descripcion, valor, fechaInicio, fechaFin, productosIds, overwrite } = req.body;

  if (!nombre || !descripcion || !valor || !fechaInicio || !fechaFin || !productosIds || productosIds.length === 0) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    if (!overwrite) {
      const productosConPromo = await sql`
        SELECT p.nombre
        FROM producto p
        JOIN promocionproducto pp ON p.idProducto = pp.idProductoFK
        JOIN promocion pr ON pr.idPromocion = pp.idPromocionFK
        WHERE p.idProducto = ANY(${productosIds}) AND pr.estado = 'activo'
      `;

      if (productosConPromo.length > 0) {
        return res.status(409).json({
          error: "Hay productos que ya tienen una promoción activa.",
          productosAfectados: productosConPromo.map(p => p.nombre)
        });
      }
    }

    if (overwrite) {
      await sql`
        DELETE FROM promocionproducto
        WHERE idProductoFK = ANY(${productosIds})
        AND idPromocionFK IN (SELECT idPromocion FROM promocion WHERE estado = 'activo')
      `;
    }

    const result = await sql`
      INSERT INTO promocion (nombre, descripcion, valor, fechainicio, fechafin, estado)
      VALUES (${nombre}, ${descripcion}, ${valor}, ${fechaInicio}, ${fechaFin}, 'activo')
      RETURNING idpromocion;
    `;

    const idPromocion = result[0].idpromocion;

    for (const idProd of productosIds) {
      await sql`
        INSERT INTO promocionproducto (idpromocionfk, idproductofk)
        VALUES (${idPromocion}, ${idProd});
      `;
    }

    return res.status(201).json({ message: "Promoción creada correctamente" });
  } catch (error) {
    console.error("Error al crear promoción:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

/* --------------------------------------------------
   PATCH /api/promotions/:id/hide (ADMIN)
-------------------------------------------------- */
export const hidePromotion = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await sql`
      UPDATE promocion
      SET estado = 'inactivo'
      WHERE idpromocion = ${id}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return res.status(404).json({ error: "Promoción no encontrada" });
    }

    return res.status(200).json({ message: "Promoción ocultada" });
  } catch (error) {
    console.error("Error hidePromotion:", error);
    return res.status(500).json({ error: "Error al ocultar promoción" });
  }
};

/* --------------------------------------------------
   PATCH /api/promotions/:id/show (ADMIN)
-------------------------------------------------- */
export const showPromotion = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await sql`
      UPDATE promocion
      SET estado = 'activo'
      WHERE idpromocion = ${id}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return res.status(404).json({ error: "Promoción no encontrada" });
    }

    return res.status(200).json({ message: "Promoción publicada" });
  } catch (error) {
    console.error("Error showPromotion:", error);
    return res.status(500).json({ error: "Error al publicar promoción" });
  }
};
