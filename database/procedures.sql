CREATE OR REPLACE PROCEDURE sp_crear_promocion(
    nombre VARCHAR,
    descripcion TEXT,
    valor INT,
    fechaInicio DATE,
    fechaFin DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    
    IF valor < 0 OR valor > 100 THEN
        RAISE EXCEPTION 'El valor de promoción debe estar entre 0 y 100';
    END IF;

    IF fechaFin <= fechaInicio THEN
        RAISE EXCEPTION 'La fecha de fin debe ser posterior a la fecha de inicio';
    END IF;

    
    INSERT INTO promocion (nombre, descripcion, valor, fechaInicio, fechaFin, estado)
    VALUES (nombre, descripcion, valor, fechaInicio, fechaFin, 'activo');
END;
$$;
