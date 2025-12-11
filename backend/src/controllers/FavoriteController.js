import { sql } from "../config/db.js";

// Obtener favoritos de un usuario
export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

    const favoritos = await sql`
        SELECT f.idProductoFK, f.fechaAgregado, p.nombre, p.precio
        FROM favorito f
        JOIN producto p ON p.idProducto = f.idProductoFK
        WHERE f.idUsuarioFK = ${userId};
    `;

    res.json(favoritos);
    } catch (error) {
        console.error("Error obteniendo favoritos:", error);
        res.status(500).json({ error: "Error obteniendo favoritos" });
    }
};

// Agregar a favoritos
export const addFavorite = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Verificar duplicado
        const exists = await sql`
            SELECT 1 FROM favorito
            WHERE idUsuarioFK = ${userId} AND idProductoFK = ${productId};
        `;

    if (exists.length > 0) {
        return res.status(400).json({ message: "El producto ya está en favoritos" });
    }

    await sql`
        INSERT INTO favorito (idUsuarioFK, idProductoFK, fechaAgregado)
        VALUES (${userId}, ${productId}, NOW()::date);
    `;

    res.json({ message: "Producto agregado a favoritos" });
    } catch (error) {
    console.error("Error agregando favorito:", error);
    res.status(500).json({ error: "Error agregando favorito" });
    }
};

// Eliminar favorito
export const removeFavorite = async (req, res) => {
    try {
        const { userId, productId } = req.params;

    await sql`
        DELETE FROM favorito
        WHERE idUsuarioFK = ${userId} AND idProductoFK = ${productId};
    `;

    res.json({ message: "Producto eliminado de favoritos" });
    } catch (error) {
    console.error("Error eliminando favorito:", error);
    res.status(500).json({ error: "Error eliminando favorito" });
    }
};

// Alternar favorito (si está lo quita, si no lo agrega)
export const toggleFavorite = async (req, res) => {
    try {
    const { userId, productId } = req.params;

    const exists = await sql`
        SELECT 1 FROM favorito
        WHERE idUsuarioFK = ${userId} AND idProductoFK = ${productId};
    `;

    if (exists.length > 0) {
        await sql`
            DELETE FROM favorito
            WHERE idUsuarioFK = ${userId} AND idProductoFK = ${productId};
        `;
        return res.json({ message: "Producto removido de favoritos" });
    }

    await sql`
        INSERT INTO favorito (idUsuarioFK, idProductoFK, fechaAgregado)
        VALUES (${userId}, ${productId}, NOW()::date);
    `;

    res.json({ message: "Producto agregado a favoritos" });
    } catch (error) {
        console.error("Error alternando favorito:", error);
        res.status(500).json({ error: "Error alternando favorito" });
    }
};
