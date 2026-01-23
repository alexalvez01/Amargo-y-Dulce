CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON lineafactura
FOR EACH ROW
EXECUTE FUNCTION trg_fn_actualizar_stock();

CREATE TRIGGER trg_reponer_stock
AFTER DELETE ON lineafactura
FOR EACH ROW
EXECUTE FUNCTION trg_fn_reponer_stock();

CREATE TRIGGER trg_actualizar_total_carrito
AFTER INSERT OR UPDATE OR DELETE ON productocarrito
FOR EACH ROW
EXECUTE FUNCTION trg_fn_actualizar_total_carrito();

CREATE TRIGGER trg_confirmar_carrito_factura
AFTER UPDATE ON carrito
FOR EACH ROW
EXECUTE FUNCTION trg_fn_confirmar_carrito_factura();

CREATE TRIGGER trg_registrar_pago_envio
AFTER INSERT ON pago
FOR EACH ROW
EXECUTE FUNCTION trg_fn_registrar_pago_envio();
