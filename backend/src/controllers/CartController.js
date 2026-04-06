import { sql } from "../config/db.js";

// Obtener carrito activo
export const getActiveCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Buscamos carritos activos o confirmados, priorizando el confirmado para detectar pagos pendientes
    const carrito = await sql`
      SELECT c.*, 
             (SELECT COUNT(*) FROM pago p 
              JOIN factura f ON p.idFacturaFK = f.idFactura 
              WHERE f.idUsuarioFK = ${userId} AND p.estado = 'finalizado'
              AND f.idFactura = (SELECT idFactura FROM factura WHERE idUsuarioFK = ${userId} ORDER BY idFactura DESC LIMIT 1)
             ) as tiene_pago
      FROM carrito c
      WHERE c.idUsuarioFK = ${userId} 
        AND (c.estado = 'activo' OR c.estado = 'confirmado')
      ORDER BY CASE WHEN c.estado = 'confirmado' THEN 1 ELSE 2 END, c.idCarrito DESC
      LIMIT 1
    `;

    if (carrito.length === 0) {
      return res.json({ message: "El usuario no tiene carrito activo.", productos: [] });
    }

    // SI el carrito es confirmado PERO ya detectamos un pago finalizado en la última factura, lo limpiamos (esto es un fallback de seguridad)
    if (carrito[0].estado === 'confirmado' && Number(carrito[0].tiene_pago) > 0) {
      const idErroneo = carrito[0].idcarrito;
      await sql`DELETE FROM productocarrito WHERE idCarritoFK = ${idErroneo}`;
      await sql`DELETE FROM carrito WHERE idCarrito = ${idErroneo}`;
      return res.json({ message: "Carrito procesado anteriormente.", productos: [] });
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

    // Buscar si ya hay un carrito (activo o confirmado)
    let carrito = await sql`
      SELECT idCarrito, estado FROM carrito
      WHERE idUsuarioFK = ${userId} 
        AND (estado = 'activo' OR estado = 'confirmado')
      ORDER BY CASE WHEN estado = 'confirmado' THEN 1 ELSE 2 END
      LIMIT 1
    `;

    if (carrito.length > 0 && carrito[0].estado === 'confirmado') {
      // Verificar si ese confirmado ya tiene pago
      const pago = await sql`
        SELECT 1 FROM pago p 
        JOIN factura f ON p.idFacturaFK = f.idFactura 
        WHERE f.idUsuarioFK = ${userId} AND p.estado = 'finalizado'
        LIMIT 1
      `;
      if (pago.length === 0) {
        return res.status(403).json({ 
          error: "Tenés un pago pendiente. Terminalo o recuperá tu carrito para seguir comprando." 
        });
      }
    }

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
    // Verificar si el carrito está bloqueado (confirmado)
    const currentStatus = await sql`SELECT estado FROM carrito WHERE idCarrito = ${idCarrito}`;
    if (currentStatus.length > 0 && currentStatus[0].estado === 'confirmado') {
      return res.status(403).json({ error: "No puedes editar un carrito con un pago pendiente." });
    }

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
    // Verificar si el carrito está bloqueado (confirmado)
    const currentStatus = await sql`SELECT estado FROM carrito WHERE idCarrito = ${idCarrito}`;
    if (currentStatus.length > 0 && currentStatus[0].estado === 'confirmado') {
      return res.status(403).json({ error: "No puedes editar un carrito con un pago pendiente." });
    }

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
    //Limpieza final asegurando que no se incorporen productos sin stock
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

// Reactivar carrito (volver de 'confirmado' a 'activo')
export const reactivateCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    // 1. Buscamos si hay una factura para este usuario que NO tenga pago aún
    const facturaPendiente = await sql`
      SELECT f.idFactura 
      FROM factura f
      LEFT JOIN pago p ON f.idFactura = p.idFacturaFK
      WHERE f.idUsuarioFK = ${userId} AND p.idPago IS NULL
      ORDER BY f.idFactura DESC LIMIT 1
    `;

    if (facturaPendiente.length === 0) {
      return res.status(400).json({ error: "No hay pedidos pendientes de cancelación o el pago ya fue procesado." });
    }

    const { idfactura } = facturaPendiente[0];

    //Borramos la factura y sus líneas para liberar el stock temporalmente
    await sql`DELETE FROM lineafactura WHERE idFacturaFK = ${idfactura}`;
    await sql`DELETE FROM factura WHERE idFactura = ${idfactura}`;

    //Volvemos a poner el carrito en 'activo'
    await sql`
      UPDATE carrito 
      SET estado = 'activo' 
      WHERE idUsuarioFK = ${userId} AND estado = 'confirmado'
    `;

    res.json({ message: "Carrito reactivado correctamente." });

  } catch (error) {
    console.error("Error al reactivar carrito:", error);
    res.status(500).json({ error: "Error al reactivar carrito" });
  }
};
