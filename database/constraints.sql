-- Constraint: carrito_idusuariofk_fkey

-- ALTER TABLE IF EXISTS public.carrito DROP CONSTRAINT IF EXISTS carrito_idusuariofk_fkey;

ALTER TABLE IF EXISTS public.carrito
    ADD CONSTRAINT carrito_idusuariofk_fkey FOREIGN KEY (idusuariofk)
    REFERENCES public.usuario (idusuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: carrito_pkey

-- ALTER TABLE IF EXISTS public.carrito DROP CONSTRAINT IF EXISTS carrito_pkey;

ALTER TABLE IF EXISTS public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (idcarrito);


-- Constraint: carrito_total_check

-- ALTER TABLE IF EXISTS public.carrito DROP CONSTRAINT IF EXISTS carrito_total_check;

ALTER TABLE IF EXISTS public.carrito
    ADD CONSTRAINT carrito_total_check CHECK (total >= 0::double precision);


-- Constraint: ciudad_pkey

-- ALTER TABLE IF EXISTS public.ciudad DROP CONSTRAINT IF EXISTS ciudad_pkey;

ALTER TABLE IF EXISTS public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (idciudad);


-- Constraint: direccion_idciudadfk_fkey

-- ALTER TABLE IF EXISTS public.direccion DROP CONSTRAINT IF EXISTS direccion_idciudadfk_fkey;

ALTER TABLE IF EXISTS public.direccion
    ADD CONSTRAINT direccion_idciudadfk_fkey FOREIGN KEY (idciudadfk)
    REFERENCES public.ciudad (idciudad) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: direccion_idusuariofk_fkey

-- ALTER TABLE IF EXISTS public.direccion DROP CONSTRAINT IF EXISTS direccion_idusuariofk_fkey;

ALTER TABLE IF EXISTS public.direccion
    ADD CONSTRAINT direccion_idusuariofk_fkey FOREIGN KEY (idusuariofk)
    REFERENCES public.usuario (idusuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: direccion_numero_check

-- ALTER TABLE IF EXISTS public.direccion DROP CONSTRAINT IF EXISTS direccion_numero_check;

ALTER TABLE IF EXISTS public.direccion
    ADD CONSTRAINT direccion_numero_check CHECK (numero > 0);


-- Constraint: direccion_pkey

-- ALTER TABLE IF EXISTS public.direccion DROP CONSTRAINT IF EXISTS direccion_pkey;

ALTER TABLE IF EXISTS public.direccion
    ADD CONSTRAINT direccion_pkey PRIMARY KEY (iddireccion);


-- Constraint: envio_codigoseguimiento_key

-- ALTER TABLE IF EXISTS public.envio DROP CONSTRAINT IF EXISTS envio_codigoseguimiento_key;

ALTER TABLE IF EXISTS public.envio
    ADD CONSTRAINT envio_codigoseguimiento_key UNIQUE (codigoseguimiento);


-- Constraint: envio_costoenvio_check

-- ALTER TABLE IF EXISTS public.envio DROP CONSTRAINT IF EXISTS envio_costoenvio_check;

ALTER TABLE IF EXISTS public.envio
    ADD CONSTRAINT envio_costoenvio_check CHECK (costoenvio > 0::double precision);


-- Constraint: envio_iddireccionfk_fkey

-- ALTER TABLE IF EXISTS public.envio DROP CONSTRAINT IF EXISTS envio_iddireccionfk_fkey;

ALTER TABLE IF EXISTS public.envio
    ADD CONSTRAINT envio_iddireccionfk_fkey FOREIGN KEY (iddireccionfk)
    REFERENCES public.direccion (iddireccion) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: envio_idfacturafk_fkey

-- ALTER TABLE IF EXISTS public.envio DROP CONSTRAINT IF EXISTS envio_idfacturafk_fkey;

ALTER TABLE IF EXISTS public.envio
    ADD CONSTRAINT envio_idfacturafk_fkey FOREIGN KEY (idfacturafk)
    REFERENCES public.factura (idfactura) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: envio_pkey

-- ALTER TABLE IF EXISTS public.envio DROP CONSTRAINT IF EXISTS envio_pkey;

ALTER TABLE IF EXISTS public.envio
    ADD CONSTRAINT envio_pkey PRIMARY KEY (idenvio);


-- Constraint: factura_idusuariofk_fkey

-- ALTER TABLE IF EXISTS public.factura DROP CONSTRAINT IF EXISTS factura_idusuariofk_fkey;

ALTER TABLE IF EXISTS public.factura
    ADD CONSTRAINT factura_idusuariofk_fkey FOREIGN KEY (idusuariofk)
    REFERENCES public.usuario (idusuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: factura_numerofactura_key

-- ALTER TABLE IF EXISTS public.factura DROP CONSTRAINT IF EXISTS factura_numerofactura_key;

ALTER TABLE IF EXISTS public.factura
    ADD CONSTRAINT factura_numerofactura_key UNIQUE (numerofactura);


-- Constraint: factura_pkey

-- ALTER TABLE IF EXISTS public.factura DROP CONSTRAINT IF EXISTS factura_pkey;

ALTER TABLE IF EXISTS public.factura
    ADD CONSTRAINT factura_pkey PRIMARY KEY (idfactura);


-- Constraint: factura_total_check

-- ALTER TABLE IF EXISTS public.factura DROP CONSTRAINT IF EXISTS factura_total_check;

ALTER TABLE IF EXISTS public.factura
    ADD CONSTRAINT factura_total_check CHECK (total >= 0::double precision);


-- Constraint: favorito_idproductofk_fkey

-- ALTER TABLE IF EXISTS public.favorito DROP CONSTRAINT IF EXISTS favorito_idproductofk_fkey;

ALTER TABLE IF EXISTS public.favorito
    ADD CONSTRAINT favorito_idproductofk_fkey FOREIGN KEY (idproductofk)
    REFERENCES public.producto (idproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: favorito_idusuariofk_fkey

-- ALTER TABLE IF EXISTS public.favorito DROP CONSTRAINT IF EXISTS favorito_idusuariofk_fkey;

ALTER TABLE IF EXISTS public.favorito
    ADD CONSTRAINT favorito_idusuariofk_fkey FOREIGN KEY (idusuariofk)
    REFERENCES public.usuario (idusuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: favorito_pkey

-- ALTER TABLE IF EXISTS public.favorito DROP CONSTRAINT IF EXISTS favorito_pkey;

ALTER TABLE IF EXISTS public.favorito
    ADD CONSTRAINT favorito_pkey PRIMARY KEY (idusuariofk, idproductofk);


-- Constraint: ingreso_cantidad_check

-- ALTER TABLE IF EXISTS public.ingreso DROP CONSTRAINT IF EXISTS ingreso_cantidad_check;

ALTER TABLE IF EXISTS public.ingreso
    ADD CONSTRAINT ingreso_cantidad_check CHECK (cantidad > 0);


-- Constraint: ingreso_idproductofk_fkey

-- ALTER TABLE IF EXISTS public.ingreso DROP CONSTRAINT IF EXISTS ingreso_idproductofk_fkey;

ALTER TABLE IF EXISTS public.ingreso
    ADD CONSTRAINT ingreso_idproductofk_fkey FOREIGN KEY (idproductofk)
    REFERENCES public.producto (idproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: ingreso_pkey

-- ALTER TABLE IF EXISTS public.ingreso DROP CONSTRAINT IF EXISTS ingreso_pkey;

ALTER TABLE IF EXISTS public.ingreso
    ADD CONSTRAINT ingreso_pkey PRIMARY KEY (idingreso);


-- Constraint: lineafactura_cantidad_check

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_cantidad_check;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_cantidad_check CHECK (cantidad > 0);


-- Constraint: lineafactura_idfacturafk_fkey

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_idfacturafk_fkey;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_idfacturafk_fkey FOREIGN KEY (idfacturafk)
    REFERENCES public.factura (idfactura) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: lineafactura_idproductofk_fkey

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_idproductofk_fkey;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_idproductofk_fkey FOREIGN KEY (idproductofk)
    REFERENCES public.producto (idproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: lineafactura_pkey

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_pkey;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_pkey PRIMARY KEY (idfacturafk, idproductofk);


-- Constraint: lineafactura_preciounitario_check

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_preciounitario_check;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_preciounitario_check CHECK (preciounitario > 0::double precision);


-- Constraint: lineafactura_subtotalproducto_check

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_subtotalproducto_check;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_subtotalproducto_check CHECK (subtotalproducto > 0::double precision);


-- Constraint: lineafactura_valordescuento_check

-- ALTER TABLE IF EXISTS public.lineafactura DROP CONSTRAINT IF EXISTS lineafactura_valordescuento_check;

ALTER TABLE IF EXISTS public.lineafactura
    ADD CONSTRAINT lineafactura_valordescuento_check CHECK (valordescuento >= 0 AND valordescuento <= 100);


-- Constraint: pago_comprobante_key

-- ALTER TABLE IF EXISTS public.pago DROP CONSTRAINT IF EXISTS pago_comprobante_key;

ALTER TABLE IF EXISTS public.pago
    ADD CONSTRAINT pago_comprobante_key UNIQUE (comprobante);


-- Constraint: pago_idfacturafk_fkey

-- ALTER TABLE IF EXISTS public.pago DROP CONSTRAINT IF EXISTS pago_idfacturafk_fkey;

ALTER TABLE IF EXISTS public.pago
    ADD CONSTRAINT pago_idfacturafk_fkey FOREIGN KEY (idfacturafk)
    REFERENCES public.factura (idfactura) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: pago_monto_check

-- ALTER TABLE IF EXISTS public.pago DROP CONSTRAINT IF EXISTS pago_monto_check;

ALTER TABLE IF EXISTS public.pago
    ADD CONSTRAINT pago_monto_check CHECK (monto > 0::double precision);


-- Constraint: pago_pkey

-- ALTER TABLE IF EXISTS public.pago DROP CONSTRAINT IF EXISTS pago_pkey;

ALTER TABLE IF EXISTS public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (idpago);


-- Constraint: producto_pkey

-- ALTER TABLE IF EXISTS public.producto DROP CONSTRAINT IF EXISTS producto_pkey;

ALTER TABLE IF EXISTS public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (idproducto);


-- Constraint: producto_stock_check

-- ALTER TABLE IF EXISTS public.producto DROP CONSTRAINT IF EXISTS producto_stock_check;

ALTER TABLE IF EXISTS public.producto
    ADD CONSTRAINT producto_stock_check CHECK (stock >= 0);


-- Constraint: productocarrito_cantidad_check

-- ALTER TABLE IF EXISTS public.productocarrito DROP CONSTRAINT IF EXISTS productocarrito_cantidad_check;

ALTER TABLE IF EXISTS public.productocarrito
    ADD CONSTRAINT productocarrito_cantidad_check CHECK (cantidad > 0);


-- Constraint: productocarrito_idcarritofk_fkey

-- ALTER TABLE IF EXISTS public.productocarrito DROP CONSTRAINT IF EXISTS productocarrito_idcarritofk_fkey;

ALTER TABLE IF EXISTS public.productocarrito
    ADD CONSTRAINT productocarrito_idcarritofk_fkey FOREIGN KEY (idcarritofk)
    REFERENCES public.carrito (idcarrito) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: productocarrito_idproductofk_fkey

-- ALTER TABLE IF EXISTS public.productocarrito DROP CONSTRAINT IF EXISTS productocarrito_idproductofk_fkey;

ALTER TABLE IF EXISTS public.productocarrito
    ADD CONSTRAINT productocarrito_idproductofk_fkey FOREIGN KEY (idproductofk)
    REFERENCES public.producto (idproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: productocarrito_pkey

-- ALTER TABLE IF EXISTS public.productocarrito DROP CONSTRAINT IF EXISTS productocarrito_pkey;

ALTER TABLE IF EXISTS public.productocarrito
    ADD CONSTRAINT productocarrito_pkey PRIMARY KEY (idcarritofk, idproductofk);


-- Constraint: productocarrito_preciounitario_check

-- ALTER TABLE IF EXISTS public.productocarrito DROP CONSTRAINT IF EXISTS productocarrito_preciounitario_check;

ALTER TABLE IF EXISTS public.productocarrito
    ADD CONSTRAINT productocarrito_preciounitario_check CHECK (preciounitario > 0::double precision);


-- Constraint: promocion_pkey

-- ALTER TABLE IF EXISTS public.promocion DROP CONSTRAINT IF EXISTS promocion_pkey;

ALTER TABLE IF EXISTS public.promocion
    ADD CONSTRAINT promocion_pkey PRIMARY KEY (idpromocion);


-- Constraint: promocion_valor_check

-- ALTER TABLE IF EXISTS public.promocion DROP CONSTRAINT IF EXISTS promocion_valor_check;

ALTER TABLE IF EXISTS public.promocion
    ADD CONSTRAINT promocion_valor_check CHECK (valor >= 0 AND valor <= 100);


-- Constraint: promocionproducto_idproductofk_fkey

-- ALTER TABLE IF EXISTS public.promocionproducto DROP CONSTRAINT IF EXISTS promocionproducto_idproductofk_fkey;

ALTER TABLE IF EXISTS public.promocionproducto
    ADD CONSTRAINT promocionproducto_idproductofk_fkey FOREIGN KEY (idproductofk)
    REFERENCES public.producto (idproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: promocionproducto_idpromocionfk_fkey

-- ALTER TABLE IF EXISTS public.promocionproducto DROP CONSTRAINT IF EXISTS promocionproducto_idpromocionfk_fkey;

ALTER TABLE IF EXISTS public.promocionproducto
    ADD CONSTRAINT promocionproducto_idpromocionfk_fkey FOREIGN KEY (idpromocionfk)
    REFERENCES public.promocion (idpromocion) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

-- Constraint: promocionproducto_pkey

-- ALTER TABLE IF EXISTS public.promocionproducto DROP CONSTRAINT IF EXISTS promocionproducto_pkey;

ALTER TABLE IF EXISTS public.promocionproducto
    ADD CONSTRAINT promocionproducto_pkey PRIMARY KEY (idpromocionfk, idproductofk);


-- Constraint: reseña_idproductofk_fkey

-- ALTER TABLE IF EXISTS public."reseña" DROP CONSTRAINT IF EXISTS "reseña_idproductofk_fkey";

ALTER TABLE IF EXISTS public."reseña"
    ADD CONSTRAINT "reseña_idproductofk_fkey" FOREIGN KEY (idproductofk)
    REFERENCES public.producto (idproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: reseña_idusuariofk_fkey

-- ALTER TABLE IF EXISTS public."reseña" DROP CONSTRAINT IF EXISTS "reseña_idusuariofk_fkey";

ALTER TABLE IF EXISTS public."reseña"
    ADD CONSTRAINT "reseña_idusuariofk_fkey" FOREIGN KEY (idusuariofk)
    REFERENCES public.usuario (idusuario) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


-- Constraint: reseña_pkey

-- ALTER TABLE IF EXISTS public."reseña" DROP CONSTRAINT IF EXISTS "reseña_pkey";

ALTER TABLE IF EXISTS public."reseña"
    ADD CONSTRAINT "reseña_pkey" PRIMARY KEY (idusuariofk, idproductofk);


-- Constraint: usuario_mail_check

-- ALTER TABLE IF EXISTS public.usuario DROP CONSTRAINT IF EXISTS usuario_mail_check;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT usuario_mail_check CHECK (mail::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text);


-- Constraint: usuario_mail_key

-- ALTER TABLE IF EXISTS public.usuario DROP CONSTRAINT IF EXISTS usuario_mail_key;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT usuario_mail_key UNIQUE (mail);


-- Constraint: usuario_pkey

-- ALTER TABLE IF EXISTS public.usuario DROP CONSTRAINT IF EXISTS usuario_pkey;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (idusuario);

