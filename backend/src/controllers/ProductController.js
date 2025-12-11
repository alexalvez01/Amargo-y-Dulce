import { sql } from "../config/db.js";

// ------------------------------------------------------------
// GET /api/products → listar todos los productos visibles
// ------------------------------------------------------------
export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * 
      FROM producto
      WHERE estado != 'inactivo'
      ORDER BY idproducto ASC;
    `;

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getAllProducts:", error);
    return res.status(500).json({ error: "Error al obtener productos" });
  }
};

// ------------------------------------------------------------
// GET /api/products/:id → detalle de un producto
// ------------------------------------------------------------
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
      SELECT * 
      FROM producto
      WHERE idproducto = ${id};
    `;

    if (product.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json(product[0]);
  } catch (error) {
    console.error("Error getProductById:", error);
    return res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// ------------------------------------------------------------
// GET /api/products/search?nombre=chocolate
// ------------------------------------------------------------
export const searchProducts = async (req, res) => {
  const { nombre } = req.query;

  try {
    const results = await sql`
      SELECT * 
      FROM producto
      WHERE LOWER(nombre) LIKE LOWER('%' || ${nombre} || '%')
      AND estado != 'inactivo';
    `;

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error searchProducts:", error);
    return res.status(500).json({ error: "Error al buscar productos" });
  }
};

// ------------------------------------------------------------
// GET /api/products/filter?estado=activo&stockMin=1
// ------------------------------------------------------------
export const filterProducts = async (req, res) => {
  const { estado, stockMin, stockMax } = req.query;

  try {
    let query = sql`SELECT * FROM producto WHERE 1=1`;

    if (estado) query = sql`${query} AND estado = ${estado}`;
    if (stockMin) query = sql`${query} AND stock >= ${stockMin}`;
    if (stockMax) query = sql`${query} AND stock <= ${stockMax}`;

    const filtered = await sql`${query} ORDER BY idproducto ASC`;

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Error filterProducts:", error);
    return res.status(500).json({ error: "Error al filtrar productos" });
  }
};

// ------------------------------------------------------------
// POST /api/products → crear producto (ADMIN)
// ------------------------------------------------------------
export const createProduct = async (req, res) => {
  const { nombre, descripcion, estado, stock, tamaño, sabor } = req.body;

  if (!nombre || !descripcion || !estado || !tamaño || !sabor) {
    return res.status(400).json({ error: "Campos obligatorios faltantes" });
  }

  try {
    const created = await sql`
      INSERT INTO producto (nombre, descripcion, estado, stock, "tamaño", sabor)
      VALUES (${nombre}, ${descripcion}, ${estado}, ${stock}, ${tamaño}, ${sabor})
      RETURNING *;
    `;

    return res.status(201).json(created[0]);
  } catch (error) {
    console.error("Error createProduct:", error);
    return res.status(500).json({ error: "Error al crear producto" });
  }
};

// ------------------------------------------------------------
// PUT /api/products/:id → editar producto (ADMIN)
// ------------------------------------------------------------
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, stock, tamaño, sabor } = req.body;

  try {
    const updated = await sql`
      UPDATE producto
      SET 
        nombre = COALESCE(${nombre}, nombre),
        descripcion = COALESCE(${descripcion}, descripcion),
        estado = COALESCE(${estado}, estado),
        stock = COALESCE(${stock}, stock),
        "tamaño" = COALESCE(${tamaño}, "tamaño"),
        sabor = COALESCE(${sabor}, sabor)
      WHERE idproducto = ${id}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json(updated[0]);
  } catch (error) {
    console.error("Error updateProduct:", error);
    return res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// ------------------------------------------------------------
// PATCH /api/products/:id/hide → ocultar producto (ADMIN)
// ------------------------------------------------------------
export const hideProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const hidden = await sql`
      UPDATE producto
      SET estado = 'inactivo'
      WHERE idproducto = ${id}
      RETURNING *;
    `;

    if (hidden.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Producto ocultado", product: hidden[0] });
  } catch (error) {
    console.error("Error hideProduct:", error);
    return res.status(500).json({ error: "Error al ocultar producto" });
  }
};

// ------------------------------------------------------------
// PATCH /api/products/:id/show → publicar producto (ADMIN)
// ------------------------------------------------------------
export const showProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const shown = await sql`
      UPDATE producto
      SET estado = 'activo'
      WHERE idproducto = ${id}
      RETURNING *;
    `;

    if (shown.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Producto publicado", product: shown[0] });
  } catch (error) {
    console.error("Error showProduct:", error);
    return res.status(500).json({ error: "Error al publicar producto" });
  }
};

