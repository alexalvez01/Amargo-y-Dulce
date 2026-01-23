CREATE OR REPLACE FUNCTION trg_fn_actualizar_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE producto
    SET stock = stock - NEW.cantidad
    WHERE idProducto = NEW.idProductoFK;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_fn_reponer_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE producto
    SET stock = stock + OLD.cantidad
    WHERE idProducto = OLD.idProductoFK;

    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION trg_fn_actualizar_total_carrito()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    nuevo_total NUMERIC(10,2);
BEGIN
    SELECT SUM(cantidad * precioUnitario)
    INTO nuevo_total
    FROM productocarrito
    WHERE idCarritoFK = NEW.idCarritoFK;

    UPDATE carrito
    SET total = COALESCE(nuevo_total, 0)
    WHERE idCarrito = NEW.idCarritoFK;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_fn_confirmar_carrito_factura()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    nueva_factura INT;
BEGIN
    IF NEW.estado = 'confirmado' AND OLD.estado <> 'confirmado' THEN

        INSERT INTO factura (idUsuarioFK, fechaCreacion, total)
        VALUES (NEW.idUsuarioFK, NOW(), NEW.total)
        RETURNING idFactura INTO nueva_factura;

        INSERT INTO lineafactura(
            idFacturaFK,
            idProductoFK,
            cantidad,
            precioUnitario,
            subtotalProducto,
            valorDescuento
        )
        SELECT
            nueva_factura,
            pc.idProductoFK,
            pc.cantidad,
            pc.precioUnitario,
            pc.cantidad * pc.precioUnitario,
            0
        FROM productocarrito pc
        WHERE pc.idCarritoFK = NEW.idCarrito;

    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_fn_registrar_pago_envio()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    nueva_id INT;
BEGIN
    INSERT INTO envio (
        iddireccionfk,
        idfacturafk,
        estado,
        fechasalida,
        fechaentregaestimada,
        costoenvio,
        codigoseguimiento
    )
    VALUES (
        (SELECT d.iddireccion 
         FROM factura f
         JOIN usuario u ON f.idusuariofk = u.idusuario
         JOIN direccion d ON d.idusuariofk = u.idusuario
         WHERE f.idfactura = NEW.idfacturafk
         LIMIT 1),
        NEW.idfacturafk,
        'preparado',
        NOW(),
        NOW() + INTERVAL '5 days',
        1000,
        NULL
    )
    RETURNING idenvio INTO nueva_id;

    UPDATE envio
    SET codigoseguimiento = fn_generar_codigo_seguimiento(nueva_id)
    WHERE idenvio = nueva_id;

    RETURN NEW;
END;
$$;

