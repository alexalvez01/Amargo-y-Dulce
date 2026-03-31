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
      return res.json({ message: "El usuario no tiene carrito activo.", productos: [] });
    }

    const idCarrito = carrito[0].idcarrito;


    // Obtener productos del carrito, incluyendo la imagen y sumando el subtotal
    const productos = await sql`
      SELECT 
        pc.idProductoFK, 
        p.nombre, 
        p.precio, 
        p.imagen,
        p."tamaño" AS tamaño,
        p.stock,
        pc.cantidad, 
        pc.precioUnitario,
        (pc.cantidad * pc.precioUnitario) as subtotal
      FROM productocarrito pc
      JOIN producto p ON p.idProducto = pc.idProductoFK
      WHERE pc.idCarritoFK = ${idCarrito}
    `;

    res.json({
      carrito: carrito[0],
      productos,
    });
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    res.status(500).json({ error: "Error obteniendo carrito" });
  }
};

// Agregar producto al carrito
export const addProductToCart = async (req, res) => {
  const userId = req.user.userId;
  const { idProducto, cantidad } = req.body;

  try {
    const prod = await sql`SELECT precio, stock, estado FROM producto WHERE idProducto = ${idProducto}`;

    if (prod.length === 0) {
      return res.status(404).json({ error: "Producto inexistente" });
    }

    if (prod[0].estado === 'inactivo') {
      return res.status(400).json({ error: "El producto no se encuentra disponible actualmente." });
    }

    const precioUnitario = prod[0].precio;
    const stockDisponible = prod[0].stock;

    // Buscar si ya hay un carrito activo
    let carrito = await sql`
      SELECT idCarrito FROM carrito
      WHERE idUsuarioFK = ${userId} AND estado = 'activo'
      LIMIT 1
    `;

    let idCarrito;

    // Si no hay carrito, crearlo
    if (carrito.length === 0) {
      const nuevo = await sql`
        INSERT INTO carrito (idUsuarioFK, estado, fechaCreacion, total)
        VALUES (${userId}, 'activo', NOW()::date, 0)
        RETURNING idCarrito
      `;
      idCarrito = nuevo[0].idcarrito;
    } else {
      idCarrito = carrito[0].idcarrito;
    }

    // Control de stock: Ver cuántos ya tengo en el carrito y cuánto quiero agregar
    const productoEnCarrito = await sql`
      SELECT cantidad FROM productocarrito
      WHERE idCarritoFK = ${idCarrito} AND idProductoFK = ${idProducto}
    `;

    const cantidadActual = productoEnCarrito.length > 0 ? productoEnCarrito[0].cantidad : 0;
    if (cantidadActual + cantidad > stockDisponible) {
      return res.status(400).json({
        error: `No hay suficiente stock. Ya tienes ${cantidadActual} en el carrito y solo quedan ${stockDisponible} disponibles.`
      });
    }


    // 4. Insertar o actualizar
    await sql`
      INSERT INTO productocarrito (idCarritoFK, idProductoFK, cantidad, precioUnitario)
      VALUES (${idCarrito}, ${idProducto}, ${cantidad}, ${precioUnitario})
      ON CONFLICT ON CONSTRAINT productocarrito_pkey 
      DO UPDATE SET cantidad = productocarrito.cantidad + EXCLUDED.cantidad
    `;

    res.json({ message: "Producto agregado al carrito", idCarrito });
  } catch (error) {
    console.error("Error agregando producto:", error);
    res.status(500).json({ error: "Error agregando producto" });
  }
};

// Modificar cantidad de un producto
export const updateProductQuantity = async (req, res) => {
  const { idCarrito, idProducto, cantidad } = req.body;

  try {
    // Verificar stock disponible del producto
    const prod = await sql`SELECT stock FROM producto WHERE idProducto = ${idProducto}`;
    
    if (prod.length === 0) {
      return res.status(404).json({ error: "Producto inexistente" });
    }

    const stockDisponible = prod[0].stock;

    if (cantidad > stockDisponible) {
      return res.status(400).json({ 
        error: `No hay suficiente stock. Solo quedan ${stockDisponible} unidades disponibles.` 
      });
    }

    // 1. Actualizamos la cantidad
    await sql`
      UPDATE productocarrito
      SET cantidad = ${cantidad}
      WHERE idCarritoFK = ${idCarrito} AND idProductoFK = ${idProducto}
    `;

    res.json({ message: "Cantidad actualizada correctamente" });
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
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
    console.error("Error eliminando producto:", error);
    res.status(500).json({ error: "Error eliminando producto" });
  }
};

// Confirmar carrito (Pasar a Checkout)
export const confirmCart = async (req, res) => {
  const { idCarrito } = req.params;

  try {
    // 1. Limpieza final asegurando que no se incorporen productos sin stock
    await sql`
      DELETE FROM productocarrito 
      WHERE idCarritoFK = ${idCarrito} 
      AND idProductoFK IN (SELECT idProducto FROM producto WHERE stock <= 0)
    `;

    // El carrito no se cambia a 'confirmado' aquí. Se hará en OrderController.
    res.json({ message: "Carrito verificado correctamente" });
  } catch (error) {
    console.error("Error confirmando carrito:", error);
    res.status(500).json({ error: "Error confirmando carrito" });
  }
};

// Cancelar carrito
export const cancelCart = async (req, res) => {
  const { idCarrito } = req.params;

  try {
    await sql`
      UPDATE carrito
      SET estado = 'cancelado'
      WHERE idCarrito = ${idCarrito}
    `;

    res.json({ message: "Carrito cancelado correctamente" });
  } catch (error) {
    console.error("Error cancelando carrito:", error);
    res.status(500).json({ error: "Error cancelando carrito" });
  }
};
