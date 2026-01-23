
CREATE TYPE rol_usuario AS ENUM ('cliente', 'admin');
CREATE TYPE estado_producto AS ENUM ('activo', 'inactivo');
CREATE TYPE tamaño_caja AS ENUM ('6', '12', '24');
CREATE TYPE sabor_bombon AS ENUM (
    'Esencia argentina',
    'Coleccion clasica',
    'Fusion moderna',
    'Delicias tropicales',
    'Tentación Intensa',
    'Seleccion gourmet'
);
CREATE TYPE estado_carrito AS ENUM ('activo', 'confirmado', 'cancelado');
CREATE TYPE estado_envio AS ENUM ('preparado', 'en proceso', 'recibido');
CREATE TYPE calificacion_reseña AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE estado_promocion AS ENUM ('activo', 'inactivo');
CREATE TYPE estado_pago AS ENUM ('espera', 'cancelado', 'finalizado');
