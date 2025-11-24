-- View: public.vw_envios_en_proceso

-- DROP VIEW public.vw_envios_en_proceso;

CREATE OR REPLACE VIEW public.vw_envios_en_proceso
 AS
 SELECT e.idenvio,
    e.codigoseguimiento,
    e.estado,
    e.fechasalida,
    e.fechaentregaestimada,
    u.idusuario,
    u.nombre AS nombreusuario,
    u.apellido AS apellidousuario,
    d.calle,
    d.numero,
    c.nombreciudad,
    c.provincia
   FROM envio e
     JOIN direccion d ON e.iddireccionfk = d.iddireccion
     JOIN usuario u ON d.idusuariofk = u.idusuario
     JOIN ciudad c ON d.idciudadfk = c.idciudad
  WHERE e.estado = 'en proceso'::estado_envio;

ALTER TABLE public.vw_envios_en_proceso
    OWNER TO neondb_owner;

-- View: public.vw_historial_compras

-- DROP VIEW public.vw_historial_compras;

CREATE OR REPLACE VIEW public.vw_historial_compras
 AS
 SELECT u.idusuario,
    u.nombre,
    u.apellido,
    f.idfactura,
    f.fechacreacion AS fecha_factura,
    lf.idproductofk AS idproducto,
    p.nombre AS nombre_producto,
    lf.cantidad,
    lf.preciounitario,
    lf.subtotalproducto,
    f.total AS total_factura
   FROM usuario u
     JOIN factura f ON u.idusuario = f.idusuariofk
     JOIN lineafactura lf ON f.idfactura = lf.idfacturafk
     JOIN producto p ON lf.idproductofk = p.idproducto
  ORDER BY u.idusuario, f.fechacreacion DESC;

ALTER TABLE public.vw_historial_compras
    OWNER TO neondb_owner;

-- View: public.vw_productos_activos

-- DROP VIEW public.vw_productos_activos;

CREATE OR REPLACE VIEW public.vw_productos_activos
 AS
 SELECT idproducto,
    nombre,
    descripcion,
    sabor,
    "tamaño",
    stock
   FROM producto p
  WHERE estado = 'activo'::estado_producto;

ALTER TABLE public.vw_productos_activos
    OWNER TO neondb_owner;

-- View: public.vw_promociones_vigentes

-- DROP VIEW public.vw_promociones_vigentes;

CREATE OR REPLACE VIEW public.vw_promociones_vigentes
 AS
 SELECT pr.idpromocion,
    pr.nombre AS nombrepromocion,
    pr.descripcion AS descripcionpromocion,
    pr.valor AS descuento,
    pr.fechainicio,
    pr.fechafin,
    p.idproducto,
    p.nombre AS nombreproducto,
    p.sabor,
    p."tamaño"
   FROM promocion pr
     JOIN promocionproducto pp ON pr.idpromocion = pp.idpromocionfk
     JOIN producto p ON pp.idproductofk = p.idproducto
  WHERE pr.estado = 'activo'::estado_promocion;

ALTER TABLE public.vw_promociones_vigentes
    OWNER TO neondb_owner;

