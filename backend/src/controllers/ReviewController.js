import { sql } from "../config/db.js";

// Obtener reseñas de un producto
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await sql`
            SELECT
                r.idUsuarioFK,
                r.fecha,
                r.calificacion,
                r.comentario,
                u.nombre
            FROM reseña r
            JOIN usuario u ON u.idUsuario = r.idUsuarioFK
            WHERE r.idProductoFK = ${productId}
            ORDER BY r.fecha DESC;
        `;

        res.json(reviews);
    } catch (error) {
        console.error("Error obteniendo reseñas:", error);
        res.status(500).json({ error: "Error obteniendo reseñas" });
    }
};

// Crear reseña
export const createReview = async (req, res) => {
    const userId = req.user.userId;

    try {
        const { productId, calificacion, comentario } = req.body;

        // Evitar reseñas duplicadas
        const exists = await sql`
            SELECT 1 FROM reseña
            WHERE idUsuarioFK = ${userId} AND idProductoFK = ${productId};
        `;

        if (exists.length > 0) {
            return res.status(400).json({
                error: "El usuario ya realizó una reseña para este producto"
            });
        }

        await sql`
            INSERT INTO reseña (
                idUsuarioFK,
                idProductoFK,
                fecha,
                calificacion,
                comentario
            )
            VALUES (
                ${userId},
                ${productId},
                NOW()::date,
                ${calificacion},
                ${comentario}
            );
        `;

        res.json({ message: "Reseña creada correctamente" });
    } catch (error) {
        console.error("Error creando reseña:", error);
        res.status(500).json({ error: "Error creando reseña" });
    }
};


// Eliminar reseña (USUARIO LOGUEADO)
export const deleteReview = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        await sql`
            DELETE FROM reseña
            WHERE idUsuarioFK = ${userId}
            AND idProductoFK = ${productId};
        `;

        res.json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        console.error("Error eliminando reseña:", error);
        res.status(500).json({ error: "Error eliminando reseña" });
    }
};