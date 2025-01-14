import pool from "../database/database.js";

const getEntregas = async (req, res) => {
    try {
        const { ano } = req.params;
        const query = `select e.numero, e.requisicion, s.nombre, e.fecha_entrega, e.total_peso
                                from entregas e
                                inner join sucursal s
                                on s.id = e.cliente_id
                                WHERE ano = ?
                                order by numero desc`;

    const [result] = await pool.query(query, [ano]); // Ejecuta la consulta
        res.json(result); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error("Error in getRequisiones:", error.message);
        res.status(500).send(error.message);
    }
};

const getEntrega = async (req, res) => {
    try {
        const { ano, entrega } = req.params;
        const query = `
            select ano, numero, requisicion, cliente_id, fecha_entrega, total_peso, total_valor, descripcion, usuario_c, usuario_m
            from entregas 
            WHERE ano = ? and numero = ?
        `;
        const [result] = await pool.query(query, [ano, entrega]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getRequision:", error.message);
        res.status(500).send(error.message);
    }
};

const addEntrega = async (req, res) => {
    try {
        const { ano, numero, requisicion, cliente_id, fecha_entrega, total_peso, total_valor, usuario_c} = req.body;

        const query = `
            INSERT INTO entregas (ano, numero, requisicion, cliente_id, fecha_entrega, total_peso, total_valor, usuario_c)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [ano, numero, requisicion, cliente_id, fecha_entrega, total_peso, total_valor, usuario_c]);
        res.json({ success: true, message: "Requisiones added successfully" });
    } catch (error) {
        console.error("Error in addRequisiones:", error.message);
        res.status(500).send(error.message);
    }
};

const updateEntrega = async (req, res) => {
    try {
        const { ano, numero } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE entregas SET ${fields} WHERE ano = ? AND numero = ?`;
        await pool.query(query, [...values, ano, numero]);

        res.json({ success: true, message: 'Requisiones actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateRequisiones:', error.message);
        res.status(500).send(error.message);
    }
};


const deleteEntrega = async (req, res) => {
    try {
        const { ano, numero } = req.params; // Obtiene el ID de los parámetros de la solicitud

        if (!ano && !numero) {
            return res.status(400).json({ success: false, message: "El ano y numero es obligatorio" });
        }

        const query = "DELETE FROM entregas WHERE ano = ? AND numero = ?;";
        const [result] = await pool.query(query, [ano, numero]); // Ejecuta la consulta con el ID

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Entrega eliminada correctamente" });
        } else {
            res.status(404).json({ success: false, message: "Entrega no encontrada" });
        }
    } catch (error) {
        console.error("Error in deleteEntrega:", error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    getEntregas,
    getEntrega,
    addEntrega,
    updateEntrega,
    deleteEntrega,


};
