
-- Table: public.carrito

-- DROP TABLE IF EXISTS public.carrito;

CREATE TABLE IF NOT EXISTS public.carrito
(
    idcarrito integer NOT NULL,
    idusuariofk integer NOT NULL,
    estado estado_carrito NOT NULL,
    fechacreacion date NOT NULL,
    total double precision,
    CONSTRAINT carrito_pkey PRIMARY KEY (idcarrito),
    CONSTRAINT carrito_idusuariofk_fkey FOREIGN KEY (idusuariofk)
        REFERENCES public.usuario (idusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT carrito_total_check CHECK (total >= 0::double precision)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.carrito
    OWNER to neondb_owner;

-- Table: public.ciudad

-- DROP TABLE IF EXISTS public.ciudad;

CREATE TABLE IF NOT EXISTS public.ciudad
(
    idciudad integer NOT NULL,
    nombreciudad character varying(50) COLLATE pg_catalog."default" NOT NULL,
    provincia character varying(50) COLLATE pg_catalog."default" NOT NULL,
    codigopostal character varying(10) COLLATE pg_catalog."default" NOT NULL,
    pais character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ciudad_pkey PRIMARY KEY (idciudad)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ciudad
    OWNER to neondb_owner;

-- Table: public.direccion

-- DROP TABLE IF EXISTS public.direccion;

CREATE TABLE IF NOT EXISTS public.direccion
(
    iddireccion integer NOT NULL,
    idusuariofk integer NOT NULL,
    idciudadfk integer NOT NULL,
    calle character varying(50) COLLATE pg_catalog."default" NOT NULL,
    numero integer,
    CONSTRAINT direccion_pkey PRIMARY KEY (iddireccion),
    CONSTRAINT direccion_idciudadfk_fkey FOREIGN KEY (idciudadfk)
        REFERENCES public.ciudad (idciudad) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT direccion_idusuariofk_fkey FOREIGN KEY (idusuariofk)
        REFERENCES public.usuario (idusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT direccion_numero_check CHECK (numero > 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.direccion
    OWNER to neondb_owner;

-- Table: public.envio

-- DROP TABLE IF EXISTS public.envio;

CREATE TABLE IF NOT EXISTS public.envio
(
    idenvio integer NOT NULL,
    iddireccionfk integer NOT NULL,
    idfacturafk integer NOT NULL,
    codigoseguimiento character varying(50) COLLATE pg_catalog."default",
    estado estado_envio NOT NULL,
    fechasalida date NOT NULL,
    fechaentregaestimada date NOT NULL,
    fechaentregareal date,
    costoenvio double precision,
    CONSTRAINT envio_pkey PRIMARY KEY (idenvio),
    CONSTRAINT envio_codigoseguimiento_key UNIQUE (codigoseguimiento),
    CONSTRAINT envio_iddireccionfk_fkey FOREIGN KEY (iddireccionfk)
        REFERENCES public.direccion (iddireccion) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT envio_idfacturafk_fkey FOREIGN KEY (idfacturafk)
        REFERENCES public.factura (idfactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT envio_costoenvio_check CHECK (costoenvio > 0::double precision)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.envio
    OWNER to neondb_owner;

-- Table: public.factura

-- DROP TABLE IF EXISTS public.factura;

CREATE TABLE IF NOT EXISTS public.factura
(
    idfactura integer NOT NULL,
    idusuariofk integer NOT NULL,
    numerofactura integer,
    fechacreacion date NOT NULL,
    total double precision,
    CONSTRAINT factura_pkey PRIMARY KEY (idfactura),
    CONSTRAINT factura_numerofactura_key UNIQUE (numerofactura),
    CONSTRAINT factura_idusuariofk_fkey FOREIGN KEY (idusuariofk)
        REFERENCES public.usuario (idusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT factura_total_check CHECK (total >= 0::double precision)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.factura
    OWNER to neondb_owner;

-- Table: public.favorito

-- DROP TABLE IF EXISTS public.favorito;

CREATE TABLE IF NOT EXISTS public.favorito
(
    idusuariofk integer NOT NULL,
    idproductofk integer NOT NULL,
    fechaagregado date NOT NULL,
    CONSTRAINT favorito_pkey PRIMARY KEY (idusuariofk, idproductofk),
    CONSTRAINT favorito_idproductofk_fkey FOREIGN KEY (idproductofk)
        REFERENCES public.producto (idproducto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT favorito_idusuariofk_fkey FOREIGN KEY (idusuariofk)
        REFERENCES public.usuario (idusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.favorito
    OWNER to neondb_owner;

-- Table: public.ingreso

-- DROP TABLE IF EXISTS public.ingreso;

CREATE TABLE IF NOT EXISTS public.ingreso
(
    idingreso integer NOT NULL,
    idproductofk integer NOT NULL,
    cantidad integer,
    fechaactualizacion date NOT NULL,
    CONSTRAINT ingreso_pkey PRIMARY KEY (idingreso),
    CONSTRAINT ingreso_idproductofk_fkey FOREIGN KEY (idproductofk)
        REFERENCES public.producto (idproducto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT ingreso_cantidad_check CHECK (cantidad > 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ingreso
    OWNER to neondb_owner;

-- Table: public.lineafactura

-- DROP TABLE IF EXISTS public.lineafactura;

CREATE TABLE IF NOT EXISTS public.lineafactura
(
    idfacturafk integer NOT NULL,
    idproductofk integer NOT NULL,
    cantidad integer,
    preciounitario double precision,
    subtotalproducto double precision,
    valordescuento integer,
    CONSTRAINT lineafactura_pkey PRIMARY KEY (idfacturafk, idproductofk),
    CONSTRAINT lineafactura_idfacturafk_fkey FOREIGN KEY (idfacturafk)
        REFERENCES public.factura (idfactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT lineafactura_idproductofk_fkey FOREIGN KEY (idproductofk)
        REFERENCES public.producto (idproducto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT lineafactura_cantidad_check CHECK (cantidad > 0),
    CONSTRAINT lineafactura_preciounitario_check CHECK (preciounitario > 0::double precision),
    CONSTRAINT lineafactura_subtotalproducto_check CHECK (subtotalproducto > 0::double precision),
    CONSTRAINT lineafactura_valordescuento_check CHECK (valordescuento >= 0 AND valordescuento <= 100)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.lineafactura
    OWNER to neondb_owner;

-- Table: public.pago

-- DROP TABLE IF EXISTS public.pago;

CREATE TABLE IF NOT EXISTS public.pago
(
    idpago integer NOT NULL,
    idfacturafk integer NOT NULL,
    fechapago date NOT NULL,
    monto double precision,
    estado estado_pago NOT NULL,
    comprobante character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT pago_pkey PRIMARY KEY (idpago),
    CONSTRAINT pago_comprobante_key UNIQUE (comprobante),
    CONSTRAINT pago_idfacturafk_fkey FOREIGN KEY (idfacturafk)
        REFERENCES public.factura (idfactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT pago_monto_check CHECK (monto > 0::double precision)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pago
    OWNER to neondb_owner;

-- Table: public.producto

-- DROP TABLE IF EXISTS public.producto;

CREATE TABLE IF NOT EXISTS public.producto
(
    idproducto integer NOT NULL,
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default" NOT NULL,
    estado estado_producto NOT NULL,
    stock integer,
    "tamaño" "tamaño_caja" NOT NULL,
    sabor sabor_bombon NOT NULL,
    CONSTRAINT producto_pkey PRIMARY KEY (idproducto),
    CONSTRAINT producto_stock_check CHECK (stock >= 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.producto
    OWNER to neondb_owner;

-- Table: public.productocarrito

-- DROP TABLE IF EXISTS public.productocarrito;

CREATE TABLE IF NOT EXISTS public.productocarrito
(
    idcarritofk integer NOT NULL,
    idproductofk integer NOT NULL,
    cantidad integer,
    preciounitario double precision,
    CONSTRAINT productocarrito_pkey PRIMARY KEY (idcarritofk, idproductofk),
    CONSTRAINT productocarrito_idcarritofk_fkey FOREIGN KEY (idcarritofk)
        REFERENCES public.carrito (idcarrito) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT productocarrito_idproductofk_fkey FOREIGN KEY (idproductofk)
        REFERENCES public.producto (idproducto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT productocarrito_cantidad_check CHECK (cantidad > 0),
    CONSTRAINT productocarrito_preciounitario_check CHECK (preciounitario > 0::double precision)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.productocarrito
    OWNER to neondb_owner;

-- Table: public.promocion

-- DROP TABLE IF EXISTS public.promocion;

CREATE TABLE IF NOT EXISTS public.promocion
(
    idpromocion integer NOT NULL,
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default" NOT NULL,
    valor integer,
    fechainicio date NOT NULL,
    fechafin date NOT NULL,
    estado estado_promocion NOT NULL,
    CONSTRAINT promocion_pkey PRIMARY KEY (idpromocion),
    CONSTRAINT promocion_valor_check CHECK (valor >= 0 AND valor <= 100)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.promocion
    OWNER to neondb_owner;

-- Table: public.promocionproducto

-- DROP TABLE IF EXISTS public.promocionproducto;

CREATE TABLE IF NOT EXISTS public.promocionproducto
(
    idpromocionfk integer NOT NULL,
    idproductofk integer NOT NULL,
    CONSTRAINT promocionproducto_pkey PRIMARY KEY (idpromocionfk, idproductofk),
    CONSTRAINT promocionproducto_idproductofk_fkey FOREIGN KEY (idproductofk)
        REFERENCES public.producto (idproducto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT promocionproducto_idpromocionfk_fkey FOREIGN KEY (idpromocionfk)
        REFERENCES public.promocion (idpromocion) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.promocionproducto
    OWNER to neondb_owner;

-- Table: public.reseña

-- DROP TABLE IF EXISTS public."reseña";

CREATE TABLE IF NOT EXISTS public."reseña"
(
    idusuariofk integer NOT NULL,
    idproductofk integer NOT NULL,
    fecha date NOT NULL,
    calificacion "calificacion_reseña" NOT NULL,
    comentario character varying(500) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "reseña_pkey" PRIMARY KEY (idusuariofk, idproductofk),
    CONSTRAINT "reseña_idproductofk_fkey" FOREIGN KEY (idproductofk)
        REFERENCES public.producto (idproducto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "reseña_idusuariofk_fkey" FOREIGN KEY (idusuariofk)
        REFERENCES public.usuario (idusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."reseña"
    OWNER to neondb_owner;

-- Table: public.usuario

-- DROP TABLE IF EXISTS public.usuario;

CREATE TABLE IF NOT EXISTS public.usuario
(
    idusuario integer NOT NULL,
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    apellido character varying(50) COLLATE pg_catalog."default" NOT NULL,
    mail character varying(100) COLLATE pg_catalog."default",
    "contraseña" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    telefono character varying(15) COLLATE pg_catalog."default" NOT NULL,
    fecharegistro date NOT NULL,
    rol rol_usuario NOT NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (idusuario),
    CONSTRAINT usuario_mail_key UNIQUE (mail),
    CONSTRAINT usuario_mail_check CHECK (mail::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.usuario
    OWNER to neondb_owner;