CREATE TABLE ciudad (
    idCiudad INT PRIMARY KEY,
    nombreCiudad VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    codigoPostal VARCHAR(10) NOT NULL,
    pais VARCHAR(50) NOT NULL
);

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    mail VARCHAR(100) UNIQUE
        CHECK (mail ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    fechaRegistro DATE NOT NULL,
    rol rol_usuario NOT NULL
);


CREATE TABLE direccion (
    idDireccion INT PRIMARY KEY,
    idUsuarioFK INT NOT NULL,
    idCiudadFK INT NOT NULL,
    calle VARCHAR(50) NOT NULL,
    numero INT CHECK (numero > 0),
    FOREIGN KEY (idUsuarioFK) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idCiudadFK) REFERENCES ciudad(idCiudad)
);


CREATE TABLE producto (
    idProducto INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    estado estado_producto NOT NULL,
    stock INT CHECK (stock >= 0),
    tamaño tamaño_caja NOT NULL,
    sabor sabor_bombon NOT NULL,
    precio FLOAT CHECK (precio > 0)
);


CREATE TABLE carrito (
    idCarrito INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuarioFK INT NOT NULL,
    estado estado_carrito NOT NULL,
    fechaCreacion DATE NOT NULL,
    total FLOAT CHECK (total >= 0),
    FOREIGN KEY (idUsuarioFK) REFERENCES usuario(idUsuario)
);


CREATE TABLE productocarrito (
    idCarritoFK INT,
    idProductoFK INT,
    cantidad INT CHECK (cantidad > 0),
    precioUnitario FLOAT CHECK (precioUnitario > 0),
    PRIMARY KEY (idCarritoFK, idProductoFK),
    FOREIGN KEY (idCarritoFK) REFERENCES carrito(idCarrito),
    FOREIGN KEY (idProductoFK) REFERENCES producto(idProducto)
);



CREATE TABLE factura (
    idFactura INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUsuarioFK INT NOT NULL,
    numeroFactura INT GENERATED ALWAYS AS IDENTITY,
    fechaCreacion DATE NOT NULL,
    total FLOAT CHECK (total >= 0),
    FOREIGN KEY (idUsuarioFK) REFERENCES usuario(idUsuario)
);


CREATE TABLE lineafactura (
    idFacturaFK INT,
    idProductoFK INT,
    cantidad INT CHECK (cantidad > 0),
    precioUnitario FLOAT CHECK (precioUnitario > 0),
    subtotalProducto FLOAT CHECK (subtotalProducto > 0),
    valorDescuento INT CHECK (valorDescuento >= 0 AND valorDescuento <= 100),
    PRIMARY KEY (idFacturaFK, idProductoFK),
    FOREIGN KEY (idFacturaFK) REFERENCES factura(idFactura),
    FOREIGN KEY (idProductoFK) REFERENCES producto(idProducto)
);


CREATE TABLE pago (
    idPago INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idFacturaFK INT NOT NULL,
    fechaPago DATE NOT NULL,
    monto FLOAT CHECK (monto > 0),
    estado estado_pago NOT NULL,
    comprobante VARCHAR(100) UNIQUE NOT NULL,
    FOREIGN KEY (idFacturaFK) REFERENCES factura(idFactura)
);



CREATE TABLE envio (
    idEnvio INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idDireccionFK INT NOT NULL,
    idFacturaFK INT NOT NULL,
    codigoSeguimiento VARCHAR(50) UNIQUE,
    estado estado_envio NOT NULL,
    fechaSalida DATE NOT NULL,
    fechaEntregaEstimada DATE NOT NULL,
    costoEnvio FLOAT CHECK (costoEnvio > 0),
    FOREIGN KEY (idDireccionFK) REFERENCES direccion(idDireccion),
    FOREIGN KEY (idFacturaFK) REFERENCES factura(idFactura)
);


CREATE TABLE ingreso (
    idIngreso INT PRIMARY KEY,
    idProductoFK INT NOT NULL,
    cantidad INT CHECK (cantidad > 0),
    fechaActualizacion DATE NOT NULL,
    FOREIGN KEY (idProductoFK) REFERENCES producto(idProducto)
);



CREATE TABLE reseña (
    idUsuarioFK INT,
    idProductoFK INT,
    fecha DATE NOT NULL,
    calificacion calificacion_reseña NOT NULL,
    comentario VARCHAR(500) NOT NULL,
    PRIMARY KEY (idUsuarioFK, idProductoFK),
    FOREIGN KEY (idUsuarioFK) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idProductoFK) REFERENCES producto(idProducto)
);



CREATE TABLE favorito (
    idUsuarioFK INT,
    idProductoFK INT,
    fechaAgregado DATE NOT NULL,
    PRIMARY KEY (idUsuarioFK, idProductoFK),
    FOREIGN KEY (idUsuarioFK) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idProductoFK) REFERENCES producto(idProducto)
);



CREATE TABLE promocion (
    idPromocion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    valor INT CHECK (valor >= 0 AND valor <= 100),
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    estado estado_promocion NOT NULL
);

CREATE TABLE promocionproducto (
    idPromocionFK INT,
    idProductoFK INT,
    PRIMARY KEY (idPromocionFK, idProductoFK),
    FOREIGN KEY (idPromocionFK) REFERENCES promocion(idPromocion),
    FOREIGN KEY (idProductoFK) REFERENCES producto(idProducto)
);


