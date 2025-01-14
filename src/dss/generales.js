import pool from "../database/database.js";

const entragasxrequisicion = async (req, res) => {
    try {
        const { ano, numero, consecutivo } = req.query;
        const query = `
            select entregas_detalle.ano, entregas_detalle.numero ,entregas.requisicion, entregas_detalle.consecutivo_afect
                from entregas
                inner join entregas_detalle
                on entregas.ano = entregas_detalle.ano and entregas.numero = entregas_detalle.numero
            WHERE entregas.ano = ?
                and entregas.requisicion = ?
                and consecutivo_afect = ?
        `;
        const [result] = await pool.query(query, [ano, numero, consecutivo]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getUser:", error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    entragasxrequisicion
};
