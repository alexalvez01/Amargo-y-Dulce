CREATE OR REPLACE VIEW vw_productos_activos AS
SELECT 
    p.idProducto,
    p.nombre,
    p.descripcion,
    p.sabor,
    p.tamaño,
    p.stock
FROM producto p
WHERE p.estado = 'activo';


CREATE OR REPLACE VIEW vw_promociones_vigentes AS
SELECT
    pr.idPromocion,
    pr.nombre AS nombrePromocion,
    pr.descripcion AS descripcionPromocion,
    pr.valor AS descuento,
    pr.fechaInicio,
    pr.fechaFin,
    p.idProducto,
    p.nombre AS nombreProducto,
    p.sabor,
    p.tamaño
FROM promocion pr
JOIN promocionproducto pp ON pr.idPromocion = pp.idPromocionFK
JOIN producto p ON pp.idProductoFK = p.idProducto
WHERE pr.estado = 'activo';


CREATE OR REPLACE VIEW vw_historial_compras AS
SELECT
    u.idUsuario,
    u.nombre,
    u.apellido,
    f.idFactura,
    f.fechaCreacion AS fecha_factura,
    lf.idProductoFK AS idProducto,
    p.nombre AS nombre_producto,
    lf.cantidad,
    lf.precioUnitario,
    lf.subtotalProducto,
    f.total AS total_factura
FROM usuario u
JOIN factura f ON u.idUsuario = f.idUsuarioFK
JOIN lineafactura lf ON f.idFactura = lf.idFacturaFK
JOIN producto p ON lf.idProductoFK = p.idProducto
ORDER BY u.idUsuario, f.fechaCreacion DESC;



CREATE OR REPLACE VIEW vw_envios_activos AS
SELECT
    e.idEnvio,
    e.codigoSeguimiento,
    e.estado,
    e.fechaSalida,
    e.fechaEntregaEstimada,
    u.idUsuario,
    u.nombre AS nombreUsuario,
    u.apellido AS apellidoUsuario,
    d.calle,
    d.numero,
    c.nombreCiudad,
    c.provincia
FROM envio e
JOIN direccion d ON e.idDireccionFK = d.idDireccion
JOIN usuario u ON d.idUsuarioFK = u.idUsuario
JOIN ciudad c ON d.idCiudadFK = c.idCiudad
WHERE e.estado IN ('preparado', 'en proceso');
