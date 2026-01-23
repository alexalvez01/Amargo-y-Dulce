CREATE OR REPLACE FUNCTION fn_calcular_total_factura(p_idFactura INT)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    total_final NUMERIC(10,2);
BEGIN
    SELECT SUM(subtotalProducto)
    INTO total_final
    FROM lineafactura
    WHERE idFacturaFK = p_idFactura;

    RETURN COALESCE(total_final, 0);
END;
$$;


CREATE OR REPLACE FUNCTION fn_generar_codigo_seguimiento(p_idEnvio INT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 'ENV-' || p_idEnvio || '-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
END;
$$;


CREATE OR REPLACE FUNCTION fn_generar_comprobante(p_idPago INT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_comprobante TEXT;
BEGIN
    v_comprobante := 'CP-' || p_idPago || '-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');

    UPDATE pago
    SET comprobante = v_comprobante
    WHERE idPago = p_idPago;

    RETURN v_comprobante;
END;
$$;


CREATE OR REPLACE FUNCTION fn_validar_stock(idProd INT, cant INT)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;
