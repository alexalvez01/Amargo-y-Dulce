
-- Type: calificacion_reseña

-- DROP TYPE IF EXISTS public."calificacion_reseña";

CREATE TYPE public."calificacion_reseña" AS ENUM
    ('1', '2', '3', '4', '5');

ALTER TYPE public."calificacion_reseña"
    OWNER TO neondb_owner;


-- Type: estado_carrito

-- DROP TYPE IF EXISTS public.estado_carrito;

CREATE TYPE public.estado_carrito AS ENUM
    ('activo', 'confirmado', 'cancelado');

ALTER TYPE public.estado_carrito
    OWNER TO neondb_owner;


-- Type: estado_envio

-- DROP TYPE IF EXISTS public.estado_envio;

CREATE TYPE public.estado_envio AS ENUM
    ('preparado', 'en proceso', 'recibido');

ALTER TYPE public.estado_envio
    OWNER TO neondb_owner;


-- Type: estado_pago

-- DROP TYPE IF EXISTS public.estado_pago;

CREATE TYPE public.estado_pago AS ENUM
    ('espera', 'cancelado', 'finalizado');

ALTER TYPE public.estado_pago
    OWNER TO neondb_owner;


-- Type: estado_producto

-- DROP TYPE IF EXISTS public.estado_producto;

CREATE TYPE public.estado_producto AS ENUM
    ('activo', 'inactivo');

ALTER TYPE public.estado_producto
    OWNER TO neondb_owner;


-- Type: estado_promocion

-- DROP TYPE IF EXISTS public.estado_promocion;

CREATE TYPE public.estado_promocion AS ENUM
    ('activo', 'inactivo');

ALTER TYPE public.estado_promocion
    OWNER TO neondb_owner;


-- Type: rol_usuario

-- DROP TYPE IF EXISTS public.rol_usuario;

CREATE TYPE public.rol_usuario AS ENUM
    ('cliente', 'admin');

ALTER TYPE public.rol_usuario
    OWNER TO neondb_owner;


-- Type: sabor_bombon

-- DROP TYPE IF EXISTS public.sabor_bombon;

CREATE TYPE public.sabor_bombon AS ENUM
    ('Esencia argentina', 'Coleccion clasica', 'Fusion moderna', 'Delicias tropicales', 'Tentación Intensa', 'Seleccion gourmet');

ALTER TYPE public.sabor_bombon
    OWNER TO neondb_owner;


-- Type: tamaño_caja

-- DROP TYPE IF EXISTS public."tamaño_caja";

CREATE TYPE public."tamaño_caja" AS ENUM
    ('6', '12', '24');

ALTER TYPE public."tamaño_caja"
    OWNER TO neondb_owner;
