
-- FUNCTION: public.trg_fn_actualizar_stock()

-- DROP FUNCTION IF EXISTS public.trg_fn_actualizar_stock();

CREATE OR REPLACE FUNCTION public.trg_fn_actualizar_stock()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    UPDATE producto
    SET stock = stock - NEW.cantidad
    WHERE idProducto = NEW.idProductoFK;

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trg_fn_actualizar_stock()
    OWNER TO neondb_owner;


-- FUNCTION: public.trg_fn_actualizar_total_carrito()

-- DROP FUNCTION IF EXISTS public.trg_fn_actualizar_total_carrito();

CREATE OR REPLACE FUNCTION public.trg_fn_actualizar_total_carrito()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
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
$BODY$;

ALTER FUNCTION public.trg_fn_actualizar_total_carrito()
    OWNER TO neondb_owner;


-- FUNCTION: public.trg_fn_confirmar_carrito_factura()

-- DROP FUNCTION IF EXISTS public.trg_fn_confirmar_carrito_factura();

CREATE OR REPLACE FUNCTION public.trg_fn_confirmar_carrito_factura()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    nueva_factura INT;
BEGIN
    IF NEW.estado = 'confirmado' AND OLD.estado <> 'confirmado' THEN

        INSERT INTO factura (idFactura, idUsuarioFK, numeroFactura, fechaCreacion, total)
        VALUES (
            nextval('factura_idfactura_seq'),
            NEW.idUsuarioFK,
            nextval('factura_numeroFactura_seq'),
            NOW(),
            NEW.total
        )
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
$BODY$;

ALTER FUNCTION public.trg_fn_confirmar_carrito_factura()
    OWNER TO neondb_owner;


-- FUNCTION: public.trg_fn_registrar_pago_envio()

-- DROP FUNCTION IF EXISTS public.trg_fn_registrar_pago_envio();

CREATE OR REPLACE FUNCTION public.trg_fn_registrar_pago_envio()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    nueva_id INT;
BEGIN
    INSERT INTO envio (
        idEnvio,
        idDireccionFK,
        idFacturaFK,
        codigoSeguimiento,
        estado,
        fechaSalida,
        fechaEntregaEstimada,
        costoEnvio
    )
    VALUES (
        nextval('envio_idenvio_seq'),
        (SELECT idDireccionFK FROM factura f
         JOIN usuario u ON f.idUsuarioFK = u.idUsuario
         JOIN direccion d ON d.idUsuarioFK = u.idUsuario
         WHERE f.idFactura = NEW.idFacturaFK LIMIT 1),
        NEW.idFacturaFK,
        NULL,
        'preparado',
        NOW(),
        NOW() + INTERVAL '5 days',
        1000
    )
    RETURNING idEnvio INTO nueva_id;

    UPDATE envio
    SET codigoSeguimiento = fn_generar_codigo_seguimiento(nueva_id)
    WHERE idEnvio = nueva_id;

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trg_fn_registrar_pago_envio()
    OWNER TO neondb_owner;


-- FUNCTION: public.trg_fn_reponer_stock()

-- DROP FUNCTION IF EXISTS public.trg_fn_reponer_stock();

CREATE OR REPLACE FUNCTION public.trg_fn_reponer_stock()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    UPDATE producto
    SET stock = stock + OLD.cantidad
    WHERE idProducto = OLD.idProductoFK;

    RETURN OLD;
END;
$BODY$;

ALTER FUNCTION public.trg_fn_reponer_stock()
    OWNER TO neondb_owner;
