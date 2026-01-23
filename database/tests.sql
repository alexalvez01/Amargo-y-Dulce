--1) Prueba de Integridad Referencial:

INSERT INTO envio (idDireccionFK, idFacturaFK, estado, fechaSalida, fechaEntregaEstimada, costoEnvio) VALUES (1, 9999, 'preparado', CURRENT_DATE, CURRENT_DATE + 5, 1500);


--2) Prueba de trigger de stock

--Ver el stock actual:

SELECT stock FROM producto WHERE idproducto = 16;

--Insertar lineafactura que activa trigger:

INSERT INTO lineafactura (
    idFacturaFK,
    idProductoFK,
    cantidad,
    precioUnitario,
    subtotalProducto,
    valorDescuento
)
VALUES
    (1, 16, 5, 5000, 25000, 0);

--Ver stock actualizado:

SELECT stock FROM producto WHERE idproducto = 16;


--3) Prueba de Trigger de Facturación

INSERT INTO productocarrito (idCarritoFK, idProductoFK, cantidad, precioUnitario) VALUES (3, 4, 2, 5200);

UPDATE carrito
SET estado = 'confirmado'
WHERE idcarrito = 3;

SELECT * FROM factura WHERE idUsuarioFK = 2 ORDER BY idFactura DESC LIMIT 1;

SELECT * FROM lineafactura WHERE idFacturaFK = (SELECT MAX(idFactura) FROM factura);


--4) Prueba de Restricciones (CHECK)

INSERT INTO promocion (idPromocion, nombre, descripcion, valor, fechaInicio, fechaFin, estado) VALUES (99, 'Promo Error', 'Prueba fallo', 150, CURRENT_DATE, CURRENT_DATE + 5, 'activo');

--5) Prueba de Funciones:

SELECT fn_calcular_total_factura(1);


--6) Prueba de Vistas:

--Consultar la vista para el producto 2 (actualmente activo):
SELECT * FROM vw_productos_activos WHERE idProducto = 2;

--Cambiar el estado del producto 2 a 'inactivo':
UPDATE producto SET estado = 'inactivo' WHERE idProducto = 2;

--Consultar la vista nuevamente:
SELECT * FROM vw_productos_activos WHERE idProducto = 2;


--7) Prueba de Permisos:

SET ROLE cliente;
DELETE FROM producto WHERE idProducto = 5;
