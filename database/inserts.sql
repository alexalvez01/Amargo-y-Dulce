INSERT INTO ciudad (idCiudad, nombreCiudad, provincia, codigoPostal, pais) VALUES
(1, 'Buenos Aires', 'Buenos Aires', '1000', 'Argentina'),
(2, 'Córdoba', 'Córdoba', '5000', 'Argentina'),
(3, 'Rosario', 'Santa Fe', '2000', 'Argentina'),
(4, 'Mendoza', 'Mendoza', '5500', 'Argentina'),
(5, 'La Plata', 'Buenos Aires', '1900', 'Argentina'),
(6, 'San Miguel de Tucumán', 'Tucumán', '4000', 'Argentina'),
(7, 'Mar del Plata', 'Buenos Aires', '7600', 'Argentina'),
(8, 'Salta', 'Salta', '4400', 'Argentina'),
(9, 'Santa Fe', 'Santa Fe', '3000', 'Argentina'),
(10, 'San Juan', 'San Juan', '5400', 'Argentina'),
(11, 'Neuquén', 'Neuquén', '8300', 'Argentina'),
(12, 'Bahía Blanca', 'Buenos Aires', '8000', 'Argentina'),
(13, 'Resistencia', 'Chaco', '3500', 'Argentina'),
(14, 'Posadas', 'Misiones', '3300', 'Argentina'),
(15, 'Ushuaia', 'Tierra del Fuego', '9410', 'Argentina');


INSERT INTO usuario (idUsuario, nombre, apellido, mail, contraseña, telefono, fechaRegistro, rol)
VALUES
(1, 'Admin', 'Principal', 'admin@correo.com', 'admin123', '1111111111', CURRENT_DATE, 'admin'),
(2, 'Juan', 'Pérez', 'juan@gmail.com', 'cliente01', '2222222222', CURRENT_DATE, 'cliente'),
(3, 'María', 'Gómez', 'maria@gmail.com', 'cliente02', '3333333333', CURRENT_DATE, 'cliente'),
(4, 'Carlos', 'López', 'carlos@gmail.com', 'cliente03', '4444444444', CURRENT_DATE, 'cliente'),
(5, 'Ana', 'Martínez', 'ana@gmail.com', 'cliente04', '5555555555', CURRENT_DATE, 'cliente'),
(6, 'Pedro', 'Sánchez', 'pedro@gmail.com', 'cliente05', '6666666666', CURRENT_DATE, 'cliente'),
(7, 'Lucía', 'Fernández', 'lucia@gmail.com', 'cliente06', '7777777777', CURRENT_DATE, 'cliente'),
(8, 'Miguel', 'Ramírez', 'miguel@gmail.com', 'cliente07', '8888888888', CURRENT_DATE, 'cliente'),
(9, 'Sofía', 'Torres', 'sofia@gmail.com', 'cliente08', '9999999999', CURRENT_DATE, 'cliente'),
(10, 'Diego', 'Flores', 'diego@gmail.com', 'cliente09', '1010101010', CURRENT_DATE, 'cliente'),
(11, 'Valentina', 'Rojas', 'valentina@gmail.com', 'cliente10', '1111111112', CURRENT_DATE, 'cliente'),
(12, 'Martín', 'Acosta', 'martin@gmail.com', 'cliente11', '1212121212', CURRENT_DATE, 'cliente'),
(13, 'Camila', 'Vega', 'camila@gmail.com', 'cliente12', '1313131313', CURRENT_DATE, 'cliente'),
(14, 'Nicolás', 'Herrera', 'nicolas@gmail.com', 'cliente13', '1414141414', CURRENT_DATE, 'cliente'),
(15, 'Florencia', 'Molina', 'florencia@gmail.com', 'cliente14', '1515151515', CURRENT_DATE, 'cliente');


INSERT INTO producto (idProducto, nombre, descripcion, estado, stock, tamaño, sabor, precio) VALUES

(1, 'Esencia Argentina', 'El equilibrio justo. Una mezcla rica entre los gustos clásicos de toda la vida y combinaciones nuevas para no aburrirse. Lo mejor de los dos mundos en una sola caja.', 'activo', 100, '6', 'Esencia argentina', 5100),
(2, 'Esencia Argentina', 'El equilibrio justo. Una mezcla rica entre los gustos clásicos de toda la vida y combinaciones nuevas para no aburrirse. Lo mejor de los dos mundos en una sola caja.', 'activo', 80, '12', 'Esencia argentina', 9350),
(3, 'Esencia Argentina', 'El equilibrio justo. Una mezcla rica entre los gustos clásicos de toda la vida y combinaciones nuevas para no aburrirse. Lo mejor de los dos mundos en una sola caja.', 'activo', 60, '24', 'Esencia argentina', 16800),


(4, 'Colección Clásica', 'Bombones de chocolate semiamargo con un sabor bien definido. Intensos pero equilibrados, los de siempre que nunca fallan.', 'activo', 100, '6', 'Coleccion clasica', 5200),
(5, 'Colección Clásica', 'Bombones de chocolate semiamargo con un sabor bien definido. Intensos pero equilibrados, los de siempre que nunca fallan.', 'activo', 80, '12', 'Coleccion clasica', 9480),
(6, 'Colección Clásica', 'Bombones de chocolate semiamargo con un sabor bien definido. Intensos pero equilibrados, los de siempre que nunca fallan.', 'activo', 60, '24', 'Coleccion clasica', 17150),


(7, 'Fusión Moderna', 'Chocolates blancos súper cremosos y dulces. Suaves, ricos y con un toque moderno que encanta.', 'activo', 100, '6', 'Fusion moderna', 5300),
(8, 'Fusión Moderna', 'Chocolates blancos súper cremosos y dulces. Suaves, ricos y con un toque moderno que encanta.', 'activo', 80, '12', 'Fusion moderna', 9600),
(9, 'Fusión Moderna', 'Chocolates blancos súper cremosos y dulces. Suaves, ricos y con un toque moderno que encanta.', 'activo', 60, '24', 'Fusion moderna', 17320),


(10, 'Delicias Tropicales', 'Chocolates con frutas tropicales frescas. Una combinación dulce y frutal que sale de lo común.', 'activo', 100, '6', 'Delicias tropicales', 6200),
(11, 'Delicias Tropicales', 'Chocolates con frutas tropicales frescas. Una combinación dulce y frutal que sale de lo común.', 'activo', 80, '12', 'Delicias tropicales', 11250),
(12, 'Delicias Tropicales', 'Chocolates con frutas tropicales frescas. Una combinación dulce y frutal que sale de lo común.', 'activo', 60, '24', 'Delicias tropicales', 20700),


(13, 'Tentación Intensa', 'Sabores fuertes y con personalidad. Cargados de frutos secos y un toque de licor. Ideales para disfrutar lentamente.', 'activo', 100, '6', 'Tentación Intensa', 6350),
(14, 'Tentación Intensa', 'Sabores fuertes y con personalidad. Cargados de frutos secos y un toque de licor. Ideales para disfrutar lentamente.', 'activo', 80, '12', 'Tentación Intensa', 11500),
(15, 'Tentación Intensa', 'Sabores fuertes y con personalidad. Cargados de frutos secos y un toque de licor. Ideales para disfrutar lentamente.', 'activo', 60, '24', 'Tentación Intensa', 21100),


(16, 'Selección Gourmet', 'Chocolates rosados con sabores exóticos. Distintos, llamativos y perfectos para regalar.', 'activo', 100, '6', 'Seleccion gourmet', 6500),
(17, 'Selección Gourmet', 'Chocolates rosados con sabores exóticos. Distintos, llamativos y perfectos para regalar.', 'activo', 80, '12', 'Seleccion gourmet', 11850),
(18, 'Selección Gourmet', 'Chocolates rosados con sabores exóticos. Distintos, llamativos y perfectos para regalar.', 'activo', 60, '24', 'Seleccion gourmet', 21500);




INSERT INTO promocion (nombre, descripcion, valor, fechaInicio, fechaFin, estado)
VALUES
('Promo Enamorados', 'Descuento del 20% en productos seleccionados', 20,
DATE '2026-02-14', DATE '2026-02-28', 'inactivo'),

('Promo Fiestas', 'Descuento del 15% por temporada', 15,
DATE '2025-12-20', DATE '2026-01-03', 'activo')

('Promo Año Nuevo 2024', 'Descuento de inicio de año', 10,
DATE '2024-01-01', DATE '2024-01-07', 'inactivo'),

('Promo San Valentín 2024', 'Promo especial parejas', 15,
DATE '2024-02-10', DATE '2024-02-18', 'inactivo'),

('Promo Pascuas 2024', 'Promo temporada Pascuas', 12,
DATE '2024-03-25', DATE '2024-03-31', 'inactivo'),

('Promo Otoño 2024', 'Descuento de temporada otoño', 8,
DATE '2024-04-01', DATE '2024-04-30', 'inactivo'),

('Promo Día del Trabajador', 'Promo 1 de mayo', 10,
DATE '2024-05-01', DATE '2024-05-03', 'inactivo'),

('Promo Invierno 2024', 'Descuento temporada invierno', 15,
DATE '2024-06-01', DATE '2024-06-30', 'inactivo'),

('Promo Vacaciones Invierno', 'Promo vacaciones de invierno', 20,
DATE '2024-07-10', DATE '2024-07-25', 'inactivo'),

('Promo Día del Niño 2024', 'Promo especial día del niño', 18,
DATE '2024-08-10', DATE '2024-08-18', 'inactivo'),

('Promo Primavera 2024', 'Descuento primavera', 12,
DATE '2024-09-01', DATE '2024-09-30', 'inactivo'),

('Promo Cyber Week 2024', 'Descuentos online', 25,
DATE '2024-10-28', DATE '2024-11-03', 'inactivo'),

('Promo Black Friday 2024', 'Black Friday', 30,
DATE '2024-11-20', DATE '2024-11-30', 'inactivo'),

('Promo Navidad 2024', 'Promo navideña', 20,
DATE '2024-12-15', DATE '2024-12-26', 'inactivo'),

('Promo Fin de Año 2024', 'Descuentos fin de año', 15,
DATE '2024-12-27', DATE '2024-12-31', 'inactivo');

INSERT INTO promocionproducto (idPromocionFK, idProductoFK) VALUES
(1, 1),
(1, 4),
(1, 7),
(2, 10),
(2, 13),
(2, 16),
(3, 2),
(4, 3),
(5, 5),
(6, 6),
(7, 8),
(8, 9),
(9, 11),
(10, 12),
(11, 14);


INSERT INTO direccion (idDireccion, idUsuarioFK, idCiudadFK, calle, numero) VALUES
(1, 1, 1,  'Av. Siempre Viva', 742),
(2, 1, 2,  'Av. Corrientes', 3500),
(3, 2, 3,  'San Martín', 1200),
(4, 2, 4,  'Rivadavia', 550),
(5, 3, 5,  'Belgrano', 880),
(6, 3, 6,  'Mitre', 290),
(7, 1, 7,  'Independencia', 432),
(8, 1, 8,  'Sarmiento', 101),
(9, 2, 9,  'Catamarca', 605),
(10, 2, 10, 'Güemes', 740),
(11, 3, 11, 'Ameghino', 900),
(12, 3, 12, 'Colon', 150),
(13, 1, 13, 'Av. San Juan', 777),
(14, 2, 14, 'Las Heras', 440),
(15, 3, 15, 'Ruta 40', 22);


INSERT INTO carrito (idCarrito, idUsuarioFK, estado, fechaCreacion, total) VALUES
(1, 2, 'confirmado', CURRENT_DATE - 10, 4500),
(2, 3, 'confirmado', CURRENT_DATE - 5, 6200),
(3, 2, 'activo',      CURRENT_DATE,     0),
(4,  4, 'confirmado', CURRENT_DATE - 20,  9800),
(5,  5, 'cancelado',  CURRENT_DATE - 15,  0),
(6,  3, 'activo',     CURRENT_DATE - 2,   3200),
(7,  6, 'confirmado', CURRENT_DATE - 8,   7400),
(8,  7, 'activo',     CURRENT_DATE - 1,   1800),
(9,  2, 'confirmado', CURRENT_DATE - 30,  15500),
(10, 8, 'confirmado', CURRENT_DATE - 12,  5100),
(11, 9, 'cancelado',  CURRENT_DATE - 7,   0),
(12, 4, 'activo',     CURRENT_DATE,       2900),
(13, 5, 'confirmado', CURRENT_DATE - 3,   8600),
(14, 6, 'confirmado', CURRENT_DATE - 18,  4300),
(15, 7, 'activo',     CURRENT_DATE,       0);

INSERT INTO productocarrito (idCarritoFK, idProductoFK, cantidad, precioUnitario) VALUES
(1, 1, 1, 5100),
(1, 4, 1, 5200),
(1, 7, 1, 5300),
(1, 10, 1, 6200),
(1, 13, 1, 6350),
(1, 2, 1, 9350),
(1, 5, 1, 9480),
(1, 8, 1, 9600),
(1, 11, 1, 11250),
(1, 14, 1, 11500),
(2, 3, 1, 16800),
(2, 6, 1, 17150),
(2, 9, 1, 17320),
(2, 12, 1, 20700),
(2, 15, 1, 21100);

INSERT INTO factura (idUsuarioFK, fechaCreacion, total)
VALUES
(2, CURRENT_DATE - 9, 76330),
(3, CURRENT_DATE - 4, 93070),
(4,  CURRENT_DATE - 15, 12450),
(5,  CURRENT_DATE - 12, 45800),
(6,  CURRENT_DATE - 20, 9990),
(7,  CURRENT_DATE - 3,  67500),
(8,  CURRENT_DATE - 8,  31200),
(9,  CURRENT_DATE - 18, 88450),
(2,  CURRENT_DATE - 30, 152300),
(3,  CURRENT_DATE - 25, 43000),
(4,  CURRENT_DATE - 6,  21400),
(5,  CURRENT_DATE - 1,  58900),
(6,  CURRENT_DATE - 14, 7700),
(7,  CURRENT_DATE - 22, 65800),
(8,  CURRENT_DATE - 10, 42000);

INSERT INTO lineafactura (idFacturaFK, idProductoFK, cantidad, precioUnitario, subtotalProducto, valorDescuento) VALUES
(1, 1, 1, 5100, 5100, 0),
(1, 4, 1, 5200, 5200, 0),
(1, 7, 1, 5300, 5300, 0),
(1, 10, 1, 6200, 6200, 0),
(1, 13, 1, 6350, 6350, 0),
(1, 2, 1, 9350, 9350, 0),
(1, 5, 1, 9480, 9480, 0),
(1, 8, 1, 9600, 9600, 0),
(1, 11, 1, 11250, 11250, 0),
(1, 14, 1, 11500, 11500, 0),
(2, 3, 1, 16800, 16800, 0),
(2, 6, 1, 17150, 17150, 0),
(2, 9, 1, 17320, 17320, 0),
(2, 12, 1, 20700, 20700, 0),
(2, 15, 1, 21100, 21100, 0);



WITH pago1 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (1, CURRENT_DATE - 8, 76330, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago2 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (2, CURRENT_DATE - 3, 93070, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago3 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (3, CURRENT_DATE - 15, 45200, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago4 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (4, CURRENT_DATE - 20, 118900, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago5 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (5, CURRENT_DATE - 1, 32900, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago6 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (6, CURRENT_DATE - 12, 87000, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago7 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (7, CURRENT_DATE - 6, 55200, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago8 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (8, CURRENT_DATE - 2, 41000, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago9 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (9, CURRENT_DATE - 18, 99000, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago10 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (10, CURRENT_DATE - 25, 134500, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago11 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (11, CURRENT_DATE - 4, 67000, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago12 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (12, CURRENT_DATE - 9, 78400, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago13 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (13, CURRENT_DATE - 30, 150000, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago14 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (14, CURRENT_DATE - 7, 50800, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
),
pago15 AS (
    INSERT INTO pago (idFacturaFK, fechaPago, monto, estado, comprobante)
    VALUES (15, CURRENT_DATE - 14, 92500, 'finalizado',
            'TMP-' || TO_CHAR(NOW(),'YYYYMMDDHH24MISS'))
    RETURNING idPago
)

SELECT fn_generar_comprobante(idPago) FROM pago1
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago2
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago3
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago4
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago5
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago6
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago7
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago8
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago9
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago10
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago11
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago12
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago13
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago14
UNION ALL SELECT fn_generar_comprobante(idPago) FROM pago15;



INSERT INTO envio (idEnvio, idDireccionFK, idFacturaFK, codigoSeguimiento,estado, fechaSalida, fechaEntregaEstimada, fechaEntregaReal, costoEnvio) VALUES
(1, 1, 1, fn_generar_codigo_seguimiento(1), 'recibido',
CURRENT_DATE - 8, CURRENT_DATE - 6, CURRENT_DATE - 7, 1500),

(2, 2, 2, fn_generar_codigo_seguimiento(2), 'en proceso',
CURRENT_DATE - 3, CURRENT_DATE + 2, NULL, 1500),

(3, 3, 3, fn_generar_codigo_seguimiento(3), 'recibido',
CURRENT_DATE - 15, CURRENT_DATE - 13, CURRENT_DATE - 14, 1800),

(4, 4, 4, fn_generar_codigo_seguimiento(4), 'recibido',
CURRENT_DATE - 20, CURRENT_DATE - 18, CURRENT_DATE - 19, 2000),

(5, 5, 5, fn_generar_codigo_seguimiento(5), 'en proceso',
CURRENT_DATE - 1, CURRENT_DATE + 4, NULL, 1500),

(6, 6, 6, fn_generar_codigo_seguimiento(6), 'preparado',
CURRENT_DATE, CURRENT_DATE + 5, NULL, 1300),

(7, 7, 7, fn_generar_codigo_seguimiento(7), 'recibido',
CURRENT_DATE - 12, CURRENT_DATE - 10, CURRENT_DATE - 11, 1700),

(8, 8, 8, fn_generar_codigo_seguimiento(8), 'en proceso',
CURRENT_DATE - 2, CURRENT_DATE + 3, NULL, 1600),

(9, 9, 9, fn_generar_codigo_seguimiento(9), 'preparado',
CURRENT_DATE, CURRENT_DATE + 6, NULL, 1400),

(10, 10, 10, fn_generar_codigo_seguimiento(10), 'recibido',
CURRENT_DATE - 25, CURRENT_DATE - 22, CURRENT_DATE - 23, 2100),

(11, 11, 11, fn_generar_codigo_seguimiento(11), 'en proceso',
CURRENT_DATE - 4, CURRENT_DATE + 1, NULL, 1500),

(12, 12, 12, fn_generar_codigo_seguimiento(12), 'recibido',
CURRENT_DATE - 9, CURRENT_DATE - 7, CURRENT_DATE - 8, 1600),

(13, 13, 13, fn_generar_codigo_seguimiento(13), 'preparado',
CURRENT_DATE, CURRENT_DATE + 7, NULL, 1400),

(14, 14, 14, fn_generar_codigo_seguimiento(14), 'en proceso',
CURRENT_DATE - 6, CURRENT_DATE - 1, NULL, 1500),

(15, 15, 15, fn_generar_codigo_seguimiento(15), 'recibido',
CURRENT_DATE - 30, CURRENT_DATE - 27, CURRENT_DATE - 28, 2200);



INSERT INTO favorito (idusuariofk, idproductofk, fechaagregado) VALUES 
(1, 10, CURRENT_DATE),
(2, 5, CURRENT_DATE),
(1, 4, CURRENT_DATE),
(1, 6, CURRENT_DATE - INTERVAL '1 day'),
(1, 9, CURRENT_DATE - INTERVAL '3 days'),
(2, 2, CURRENT_DATE),
(2, 7, CURRENT_DATE - INTERVAL '2 days'),
(2, 15, CURRENT_DATE),
(3, 1, CURRENT_DATE - INTERVAL '5 days'),
(3, 11, CURRENT_DATE),
(3, 18, CURRENT_DATE - INTERVAL '1 day'),
(3, 8, CURRENT_DATE),
(3, 13, CURRENT_DATE - INTERVAL '4 days'),
(3, 5, CURRENT_DATE),
(3, 10, CURRENT_DATE - INTERVAL '6 days');

INSERT INTO reseña (idUsuarioFK, idProductoFK, fecha, calificacion, comentario) VALUES
(1, 1, '2024-01-10', '5', 'Excelente sabor, muy equilibrado.'),
(1, 4, '2024-01-12', '4', 'Muy ricos, aunque un poco dulces.'),
(1, 7, '2024-01-15', '5', 'Mis favoritos de toda la línea.'),

(2, 2, '2024-02-03', '3', 'Ricos pero esperaba más variedad.'),
(2, 5, '2024-02-05', '4', 'Buena relación calidad-precio.'),
(2, 10, '2024-02-08', '5', 'Los tropicales son lo mejor.'),

(3, 3, '2024-03-01', '5', 'Presentación impecable y muy sabrosos.'),
(3, 6, '2024-03-04', '4', 'Muy buenos, un clásico que nunca falla.'),
(3, 9, '2024-03-07', '5', 'Si te gusta el chocolate blanco, son perfectos.'),

(1, 12, '2024-04-01', '4', 'Muy buena caja, combinaciones interesantes.'),
(2, 8, '2024-04-03', '2', 'Demasiado dulces para mi gusto.'),
(3, 15, '2024-04-06', '5', 'Intensos y deliciosos.'),

(1, 11, '2024-05-01', '5', 'La mezcla frutal está muy bien lograda.'),
(2, 14, '2024-05-03', '4', 'Un gusto fuerte pero muy rico.'),
(3, 18, '2024-05-05', '5', 'Los rosados son lo máximo.');


INSERT INTO ingreso (idIngreso, idProductoFK, cantidad, fechaActualizacion) VALUES
(1, 1, 20, '2024-01-01'),
(2, 2, 15, '2024-01-02'),
(3, 3, 30, '2024-01-03'),

(4, 4, 10, '2024-02-01'),
(5, 5, 25, '2024-02-03'),
(6, 6, 18, '2024-02-05'),

(7, 7, 40, '2024-03-01'),
(8, 8, 20, '2024-03-03'),
(9, 9, 12, '2024-03-05'),

(10, 10, 15, '2024-04-01'),
(11, 11, 30, '2024-04-04'),
(12, 12, 18, '2024-04-08'),

(13, 13, 25, '2024-05-01'),
(14, 14, 20, '2024-05-05'),
(15, 15, 35, '2024-05-09');
