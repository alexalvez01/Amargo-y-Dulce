import { sql } from "../config/db.js";


// Obtener todos los productos

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


// Obtener producto por ID

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


// Buscar productos por nombre

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


// Filtrar productos por tamaño y sabor

export const filterProducts = async (req, res) => {
  const { tamaño, sabor } = req.query;

  try {
    let query = sql`SELECT * FROM producto WHERE 1=1`;

    if (tamaño) query = sql`${query} AND "tamaño" = ${tamaño}`;
    if (sabor) query = sql`${query} AND sabor = ${sabor}`;

    const filtered = await sql`${query} ORDER BY idproducto ASC`;

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Error filterProducts:", error);
    return res.status(500).json({ error: "Error al filtrar productos" });
  }
};

// Crear nuevo producto (ADMIN)

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


// Actualizar producto (ADMIN)

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


// Ocultar producto (ADMIN)

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


// Publicar producto (ADMIN)

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

