import pool from "../database/database.js";

const getNextID = async (req, res) => {
    const { tableName } = req.query; // Nombre de la tabla recibido como parámetro

    if (!tableName) {
        return res.status(400).json({ error: "El nombre de la tabla es requerido." });
    }

    try {
        // Construir la consulta para obtener el máximo ID
        const query = `SELECT COALESCE(MAX(id), 0) + 1 AS next FROM ??`; // ?? es un marcador de posición para tablas
        const [result] = await pool.query(query, [tableName]); // Evita inyecciones SQL

        // Devolver el próximo ID disponible
        res.json({ next: result[0].next });
    } catch (error) {
        console.error("Error in getNextID:", error.message);
        res.status(500).json({ error: error.message });
    }
}

// Función para obtener el siguiente número de una tabla con un filtro de año
const getNextNumero = async (req, res) => {
    const { tableName, ano } = req.query; // Obtener los parámetros de la consulta (query params)

    if (!tableName || !ano) {
        return res.status(400).json({ error: "El nombre de la tabla y el año son requeridos." });
    }

    try {
        // Consulta para obtener el siguiente número para el año específico
        const query = `SELECT COALESCE(MAX(numero), 0) + 1 AS next FROM \`${tableName}\` WHERE ano = ?`;
        const [result] = await pool.query(query, [ano]);

        // Responder con el siguiente número disponible
        res.json({ next: result[0].next });
    } catch (error) {
        console.error("Error in getNextNumero:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const getNextConsecutivo = async (req, res) => {
    const { tableName, ano, numero } = req.query; // Obtener los parámetros de la consulta (query params)

    if (!tableName || !ano) {
        return res.status(400).json({ error: "El nombre de la tabla y el año son requeridos." });
    }

    try {
        // Consulta para obtener el siguiente consecutivo para el año específico
        //SELECT COALESCE(MAX(consecutivo), 0) + 1 AS next FROM requisicion_detalles WHERE ano = 2025 AND numero =  324
        const query = `SELECT COALESCE(MAX(consecutivo), 0) + 1 AS next FROM \`${tableName}\` WHERE ano = ? AND numero = ?`;
        const [result] = await pool.query(query, [ano, numero]);

        // Responder con el siguiente número disponible
        res.json({ next: result[0].next });
    } catch (error) {
        console.error("Error in getNextNumero:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const methods = { getNextID, getNextNumero, getNextConsecutivo};