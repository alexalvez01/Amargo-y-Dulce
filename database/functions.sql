-- FUNCTION: public.fn_calcular_total_factura(integer)

-- DROP FUNCTION IF EXISTS public.fn_calcular_total_factura(integer);

CREATE OR REPLACE FUNCTION public.fn_calcular_total_factura(
	p_idfactura integer)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    total_final NUMERIC(10,2);
BEGIN
    SELECT SUM(subtotalProducto)
    INTO total_final
    FROM lineafactura
    WHERE idFacturaFK = p_idFactura;

    RETURN COALESCE(total_final, 0);
END;
$BODY$;

ALTER FUNCTION public.fn_calcular_total_factura(integer)
    OWNER TO neondb_owner;

-- FUNCTION: public.fn_generar_codigo_seguimiento(integer)

-- DROP FUNCTION IF EXISTS public.fn_generar_codigo_seguimiento(integer);

CREATE OR REPLACE FUNCTION public.fn_generar_codigo_seguimiento(
	p_idenvio integer)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    RETURN 'ENV-' || p_idEnvio || '-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
END;
$BODY$;

ALTER FUNCTION public.fn_generar_codigo_seguimiento(integer)
    OWNER TO neondb_owner;

-- FUNCTION: public.fn_validar_stock(integer, integer)

-- DROP FUNCTION IF EXISTS public.fn_validar_stock(integer, integer);

CREATE OR REPLACE FUNCTION public.fn_validar_stock(
	idprod integer,
	cant integer)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    stock_actual INT;
BEGIN
    SELECT stock INTO stock_actual
    FROM producto
    WHERE idProducto = idProd;

    IF stock_actual IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN stock_actual >= cant;
END;
$BODY$;

ALTER FUNCTION public.fn_validar_stock(integer, integer)
    OWNER TO neondb_owner;

