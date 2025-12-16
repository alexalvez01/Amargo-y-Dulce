import { sql } from "../config/db.js";

// Obtener carrito activo

export const getActiveCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const carrito = await sql`
      SELECT *
      FROM carrito
      WHERE idUsuarioFK = ${userId} AND estado = 'activo'
      LIMIT 1
    `;

    if (carrito.length === 0) {
      return res.json({ message: "El usuario no tiene carrito activo." });
    }

    const idCarrito = carrito[0].idcarrito;

    // Obtener productos del carrito
    const productos = await sql`
      SELECT pc.idProductoFK, p.nombre, p.precio, pc.cantidad, pc.precioUnitario
      FROM productocarrito pc
      JOIN producto p ON p.idProducto = pc.idProductoFK
      WHERE pc.idCarritoFK = ${idCarrito}
    `;

    res.json({
      carrito: carrito[0],
      productos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo carrito" });
  }
};

// Agregar producto al carrito

export const addProductToCart = async (req, res) => {
  const userId = req.user.userId;
  const { idProducto, cantidad } = req.body;

  try {
    let carrito = await sql`
      SELECT * FROM carrito
      WHERE idusuariofk = ${userId} AND estado = 'activo'
      LIMIT 1
    `;

    let idCarrito;

    // Si no hay carrito, crea uno
    if (carrito.length === 0) {
      const nuevo = await sql`
        INSERT INTO carrito (idUsuarioFK, estado, fechaCreacion, total)
        VALUES (
          ${userId},
          'activo',
          NOW(),
          0
        )
        RETURNING idCarrito
      `;

      idCarrito = nuevo[0].idcarrito;
    } else {
      idCarrito = carrito[0].idcarrito;
    }

    // Obtener precio del producto
    const prod = await sql`
      SELECT precio FROM producto WHERE idProducto = ${idProducto}
    `;

    if (prod.length === 0)
      return res.status(400).json({ error: "Producto inexistente" });

    const precioUnitario = prod[0].precio;

    // Insertar producto
    await sql`
      INSERT INTO productocarrito (idCarritoFK, idProductoFK, cantidad, precioUnitario)
      VALUES (${idCarrito}, ${idProducto}, ${cantidad}, ${precioUnitario})
    `;

    res.json({ message: "Producto agregado al carrito", idCarrito });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error agregando producto" });
  }
};

//  Modificar cantidad de un producto

export const updateProductQuantity = async (req, res) => {
  const { idCarrito, idProducto, cantidad } = req.body;

  try {
    await sql`
      UPDATE productocarrito
      SET cantidad = ${cantidad}
      WHERE idCarritoFK = ${idCarrito} AND idProductoFK = ${idProducto}
    `;

    res.json({ message: "Cantidad actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando cantidad" });
  }
};

// Eliminar un producto

export const removeProductFromCart = async (req, res) => {
  const { idCarrito, idProducto } = req.body;

  try {
    await sql`
      DELETE FROM productocarrito
      WHERE idCarritoFK = ${idCarrito} AND idProductoFK = ${idProducto}
    `;

    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando producto" });
  }
};

// Confirmar carrito

export const confirmCart = async (req, res) => {
  const { idCarrito } = req.params;

  try {
    // Cambiar estado
    await sql`
      UPDATE carrito
      SET estado = 'confirmado'
      WHERE idCarrito = ${idCarrito}
    `;

    res.json({ message: "Carrito confirmado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error confirmando carrito" });
  }
};
