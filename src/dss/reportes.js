import pool from "../database/database.js";

const getConsulta = async (req, res) => {
    try {
        const { codigo } = req.query;
        const query = `
            SELECT consulta, parametros 
            FROM consultas  
            WHERE codigo = ?
        `;
        const [result] = await pool.query(query, [codigo]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getUser:", error.message);
        res.status(500).send(error.message);
    }
};

const getData = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).send("Query is required");
        }

        // Validar que la consulta comience con 'SELECT'
        const queryTrimmed = query.trim().toUpperCase();
        if (!queryTrimmed.startsWith("SELECT")) {
            return res.status(400).send("Only SELECT queries are allowed.");
        }

        // Ejecuta la consulta
        const [result] = await pool.query(query);

        // Devuelve los resultados como JSON
        res.json(result);
    } catch (error) {
        console.error("Error in getData:", error.message);
        res.status(500).send(error.message);
    }
};


export const methods = {
    getConsulta, getData
};
