CREATE ROLE admin_db WITH
    LOGIN
    PASSWORD '#Administrador.123'


CREATE ROLE empleado WITH
    LOGIN
    PASSWORD '#Empleado.123'
    INHERIT;



CREATE ROLE cliente WITH
    LOGIN
    PASSWORD '#Cliente.123'
    INHERIT;
