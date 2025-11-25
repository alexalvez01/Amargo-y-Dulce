-- PROCEDURE: public.sp_crear_promocion(integer, character varying, text, integer, date, date)

-- DROP PROCEDURE IF EXISTS public.sp_crear_promocion(integer, character varying, text, integer, date, date);

CREATE OR REPLACE PROCEDURE public.sp_crear_promocion(
	IN idpromocion integer,
	IN nombre character varying,
	IN descripcion text,
	IN valor integer,
	IN fechainicio date,
	IN fechafin date)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    -- Validación del valor
    IF valor < 0 OR valor > 100 THEN
        RAISE EXCEPTION 'El valor de promoción debe estar entre 0 y 100';
    END IF;

    -- Validación de fechas
    IF fechaFin <= fechaInicio THEN
        RAISE EXCEPTION 'La fecha de fin debe ser posterior a la fecha de inicio';
    END IF;

    -- Insertar la promoción con el ID que pasa el usuario
    INSERT INTO promocion (idPromocion, nombre, descripcion, valor, fechaInicio, fechaFin, estado)
    VALUES (idPromocion, nombre, descripcion, valor, fechaInicio, fechaFin, 'activo');
END;
$BODY$;
ALTER PROCEDURE public.sp_crear_promocion(integer, character varying, text, integer, date, date)
    OWNER TO neondb_owner;
