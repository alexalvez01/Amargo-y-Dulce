import { sql } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Registrar nuevo usuario

export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    mail,
    contraseña,
    telefono,
    rol = "cliente"
  } = req.body;

  if (!nombre || !apellido || !mail || !contraseña || !telefono) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const exists = await sql`
      SELECT idusuario
      FROM usuario
      WHERE mail = ${mail}
    `;

    if (exists.length > 0) {
      return res.status(400).json({ error: "El mail ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await sql`
      INSERT INTO usuario (
        idUsuario,
        nombre,
        apellido,
        mail,
        contraseña,
        telefono,
        fechaRegistro,
        rol
      )
      VALUES (
        (SELECT COALESCE(MAX(idUsuario),0) + 1 FROM usuario),
        ${nombre},
        ${apellido},
        ${mail},
        ${hashedPassword},
        ${telefono},
        CURRENT_DATE,
        ${rol}
      )
      RETURNING idUsuario, nombre, apellido, mail, rol;
    `;

    res.status(201).json(nuevoUsuario[0]);

  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
};


// Iniciar sesión con usuario existente

export const login = async (req, res) => {
  const { mail, contraseña } = req.body;

  if (!mail || !contraseña) {
    return res.status(400).json({ error: "Mail y contraseña requeridos" });
  }

  try {
    const user = await sql`
      SELECT idusuario, nombre, apellido, contraseña, rol
      FROM usuario
      WHERE mail = ${mail}
    `;
    if (user.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordOk = await bcrypt.compare(
      contraseña,
      user[0].contraseña
    );

    if (!passwordOk) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        userId: user[0].idusuario,
        rol: user[0].rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        idUsuario: user[0].idusuario,
        nombre: user[0].nombre,
        apellido: user[0].apellido,
        rol: user[0].rol
      }
    });

  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ error: "Error en login" });
  }
};


// Cerrar sesión de usuario

export const logout = async (req, res) => {
  res.json({ message: "Logout exitoso" });
};
