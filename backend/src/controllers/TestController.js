import { sql } from "../config/db.js";

// GET /ping — prueba de conexión
export const ping = async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    res.json({ db_version: result[0].version });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en /ping" });
  }
};

// GET /productos — ejemplo de SELECT
export const getProductos = async (req, res) => {
  try {
    const productos = await sql`SELECT * FROM producto LIMIT 5`;
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
};

// POST /promocion — ejemplo llamando función SQL
export const crearPromocion = async (req, res) => {
  const { idProducto, valor } = req.body;

  try {
    const result = await sql`
      SELECT crear_promocion(${idProducto}, ${valor});
    `;

    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear promoción" });
  }
};
