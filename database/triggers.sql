
-- Trigger: trg_confirmar_carrito_factura

-- DROP TRIGGER IF EXISTS trg_confirmar_carrito_factura ON public.carrito;

CREATE OR REPLACE TRIGGER trg_confirmar_carrito_factura
    AFTER UPDATE 
    ON public.carrito
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_fn_confirmar_carrito_factura();

-- Trigger: trg_actualizar_stock

-- DROP TRIGGER IF EXISTS trg_actualizar_stock ON public.lineafactura;

CREATE OR REPLACE TRIGGER trg_actualizar_stock
    AFTER INSERT
    ON public.lineafactura
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_fn_actualizar_stock();

-- Trigger: trg_reponer_stock

-- DROP TRIGGER IF EXISTS trg_reponer_stock ON public.lineafactura;

CREATE OR REPLACE TRIGGER trg_reponer_stock
    AFTER DELETE
    ON public.lineafactura
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_fn_reponer_stock();

-- Trigger: trg_registrar_pago_envio

-- DROP TRIGGER IF EXISTS trg_registrar_pago_envio ON public.pago;

CREATE OR REPLACE TRIGGER trg_registrar_pago_envio
    AFTER INSERT
    ON public.pago
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_fn_registrar_pago_envio();

-- Trigger: trg_actualizar_total_carrito

-- DROP TRIGGER IF EXISTS trg_actualizar_total_carrito ON public.productocarrito;

CREATE OR REPLACE TRIGGER trg_actualizar_total_carrito
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.productocarrito
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_fn_actualizar_total_carrito();