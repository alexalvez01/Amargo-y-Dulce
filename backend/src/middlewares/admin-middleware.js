// src/middlewares/admin-middleware.js
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Verificamos token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // El token debe tener un userId
    if (!decoded.userId) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Buscamos usuario en base de datos
    const user = await sql`
      SELECT id, role
      FROM users
      WHERE id = ${decoded.userId}
    `;

    if (user.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si el usuario NO es admin
    if (user[0].role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Solo admin." });
    }

    // Agregamos los datos del usuario a la request
    req.user = user[0];

    next(); // continúa a la ruta
  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
