import pool from "../database/database.js";

const getRequisiones = async (req, res) => {
    try {
        const { ano } = req.params;
        const query = `select r.numero, s.nombre, r.fecha_recibido, r.total_peso
                              from requisiciones r
                              inner join sucursal s
                              on s.id = r.cliente_id
                              WHERE ano = ?
                              order by numero desc`;

    const [result] = await pool.query(query, [ano]); // Ejecuta la consulta
        res.json(result); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error("Error in getRequisiones:", error.message);
        res.status(500).send(error.message);
    }
};

const getRequision = async (req, res) => {
    try {
        const { ano, requisicion } = req.params;
        const query = `
            select ano, numero, cliente_id, fecha_recibido, fecha_entrega, descripcion, total_peso, valor_total, usuario 
            FROM requisiciones 
            WHERE ano = ? and numero = ?
        `;
        const [result] = await pool.query(query, [ano, requisicion]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getRequision:", error.message);
        res.status(500).send(error.message);
    }
};

const addRequisiones = async (req, res) => {
    try {
        const { ano, numero, cliente_id, fecha_recibido, fecha_entrega, descripcion, total_peso, valor_total, usuario} = req.body;

        const query = `
            INSERT INTO requisiciones (ano, numero, cliente_id, fecha_recibido, fecha_entrega, descripcion, total_peso, valor_total, usuario)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [ano, numero, cliente_id, fecha_recibido, fecha_entrega, descripcion, total_peso, valor_total, usuario]);
        res.json({ success: true, message: "Requisiones added successfully" });
    } catch (error) {
        console.error("Error in addRequisiones:", error.message);
        res.status(500).send(error.message);
    }
};

const updateRequisiones = async (req, res) => {
    try {
        const { ano, numero } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE requisiciones SET ${fields} WHERE ano = ? AND numero = ?`;
        await pool.query(query, [...values, ano, numero]);

        res.json({ success: true, message: 'Requisiones actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateRequisiones:', error.message);
        res.status(500).send(error.message);
    }
};


const deleteRequisiones = async (req, res) => {
    try {
        const { ano, numero } = req.params; // Obtiene el ID de los parámetros de la solicitud

        if (!ano && !numero) {
            return res.status(400).json({ success: false, message: "El ano y numero es obligatorio" });
        }

        const query = "DELETE FROM requisiciones WHERE ano = ? AND numero = ?;";
        const [result] = await pool.query(query, [ano, numero]); // Ejecuta la consulta con el ID

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Requisiones eliminada correctamente" });
        } else {
            res.status(404).json({ success: false, message: "Requisiones no encontrada" });
        }
    } catch (error) {
        console.error("Error in deleteRequisiones:", error.message);
        res.status(500).send(error.message);
    }
};

const getRequisicionesConSaldo = async (req, res) => {
    try {
        const { ano } = req.query;
        const query = `
                            select numero from requisicion_detalles
                            where ano = ? and saldo > 0
                            group by numero
                            order by numero
                    `;
        const [result] = await pool.query(query, [ano]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getRequisicionesConSaldo:", error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    getRequisiones,
    getRequision,
    addRequisiones,
    updateRequisiones,
    deleteRequisiones,
    getRequisicionesConSaldo


};
