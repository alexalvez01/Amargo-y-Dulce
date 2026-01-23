--Admin_db

GRANT ALL PRIVILEGES ON DATABASE neondb TO admin_db;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_db;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_db;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin_db;


--Empleado

GRANT SELECT, INSERT, UPDATE ON
    producto,
    envio,
    factura,
    usuario
TO empleado;

GRANT SELECT ON
    lineafactura,
    productocarrito
TO empleado;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO empleado;

--Cliente

GRANT SELECT ON
    producto,
    promocion
TO cliente;


GRANT SELECT ON
    vw_productos_activos,
    vw_historial_compras
TO cliente;

GRANT INSERT ON
    carrito,
    pago,
    reseña,
    favorito
TO cliente;

GRANT UPDATE ON carrito TO cliente;
