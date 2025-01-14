import pool from "../database/database.js";

const getEntregaDet = async (req, res) => {
    try {
        const { ano, numero } = req.params;

        const query = `select ed.ano, ed.numero, ed.consecutivo, ed.id_producto, c.producto, ed.saldo_req, ed.peso_req, ed.cant_entregada, ed.peso_entregado, ed.observacion
                              from entregas_detalle ed
                              inner join catalogo c
                              on c.id = ed.id_producto
                              WHERE ed.ano = ? 
                              and ed.numero = ?
                              order by consecutivo;
        `;
        const [result] = await pool.query(query, [ano, numero]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getEntregaDet:", error.message);
        res.status(500).send(error.message);
    }
};

const addEntregaDet = async (req, res) => {
    try {
        const { ano, numero, consecutivo, id_producto, saldo_req, peso_req, cant_entregada, peso_entregado, observacion, usuario_c, consecutivo_afect} = req.body;

        const query = `
            INSERT INTO entregas_detalle (ano, numero, consecutivo, id_producto, saldo_req, peso_req, cant_entregada, peso_entregado, observacion, usuario_c, consecutivo_afect)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [ano, numero, consecutivo, id_producto, saldo_req, peso_req, cant_entregada, peso_entregado, observacion, usuario_c, consecutivo_afect]);
        res.json({ success: true, message: "Entrega added successfully" });
    } catch (error) {
        console.error("Error in addEntrega:", error.message);
        res.status(500).send(error.message);
    }
};

const updateEntregaDet = async (req, res) => {
    try {
        const { ano, numero, consecutivo } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE entregas_detalle SET ${fields} WHERE ano = ? AND numero = ? AND consecutivo = ?`;
        await pool.query(query, [...values, ano, numero, consecutivo]);

        res.json({ success: true, message: 'Entrega actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateEntregaDet:', error.message);
        res.status(500).send(error.message);
    }
};


const deleteEntregaDet = async (req, res) => {
    try {
        const { ano, numero, consecutivo } = req.params; // Obtiene el ID de los parámetros de la solicitud

        if (!ano && !numero) {
            return res.status(400).json({ success: false, message: "El ano y numero es obligatorio" });
        }

        const query = "DELETE FROM entregas_detalle WHERE ano = ? AND numero = ? AND consecutivo = ?;";
        const [result] = await pool.query(query, [ano, numero, consecutivo]); // Ejecuta la consulta con el ID

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Detalle Entrega eliminada correctamente" });
        } else {
            res.status(404).json({ success: false, message: "Detalle Entrega no encontrada" });
        }
    } catch (error) {
        console.error("Error in delete Detalle Entrega:", error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    getEntregaDet,
    addEntregaDet,
    updateEntregaDet,
    deleteEntregaDet,


};
