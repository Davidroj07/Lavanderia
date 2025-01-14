import pool from "../database/database.js";

const getRequisionDet = async (req, res) => {
    try {
        const { ano, numero } = req.params;

        const query = `
            select rd.ano, rd.numero, rd.consecutivo, rd.id_producto, c.producto, rd.cantidad_recibida, rd.saldo, rd.peso, rd.valor, rd.reproceso, rd.observacion
                              from requisicion_detalles rd
                              inner join catalogo c
                              on c.id = rd.id_producto
                              WHERE rd.ano = ? 
                              and rd.numero = ?
                              order by consecutivo;
        `;
        const [result] = await pool.query(query, [ano, numero]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getRequision:", error.message);
        res.status(500).send(error.message);
    }
};

const addRequisionesDet = async (req, res) => {
    try {
        const { ano, numero, consecutivo, id_producto, cantidad_recibida, saldo, peso, valor, reproceso, observacion} = req.body;

        const query = `
            INSERT INTO requisicion_detalles (ano, numero, consecutivo, id_producto, cantidad_recibida, saldo, peso, valor, reproceso, observacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [ano, numero, consecutivo, id_producto, cantidad_recibida, saldo, peso, valor, reproceso, observacion]);
        res.json({ success: true, message: "Requisiones added successfully" });
    } catch (error) {
        console.error("Error in addRequisiones:", error.message);
        res.status(500).send(error.message);
    }
};

const updateRequisionesDet = async (req, res) => {
    try {
        const { ano, numero, consecutivo } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE requisicion_detalles SET ${fields} WHERE ano = ? AND numero = ? AND consecutivo = ?`;
        await pool.query(query, [...values, ano, numero, consecutivo]);

        res.json({ success: true, message: 'Requisiones actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateRequisionesDet:', error.message);
        res.status(500).send(error.message);
    }
};


const deleteRequisionesDet = async (req, res) => {
    try {
        const { ano, numero, consecutivo } = req.params; // Obtiene el ID de los parámetros de la solicitud

        if (!ano && !numero) {
            return res.status(400).json({ success: false, message: "El ano y numero es obligatorio" });
        }

        const query = "DELETE FROM requisicion_detalles WHERE ano = ? AND numero = ? AND consecutivo = ?;";
        const [result] = await pool.query(query, [ano, numero, consecutivo]); // Ejecuta la consulta con el ID

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

const getReqDetalleConSaldo = async (req, res) => {
    try {
        const { ano, numero, requisicion } = req.query;
        const query = `
            select requisicion_detalles.ano, requisicion_detalles.numero, requisicion_detalles.consecutivo, requisicion_detalles.id_producto,catalogo.producto,
                   requisicion_detalles.cantidad_recibida, requisicion_detalles.saldo, requisicion_detalles.peso
                    from requisicion_detalles
                     left join (select entregas_detalle.ano, entregas_detalle.numero ,entregas.requisicion, entregas_detalle.consecutivo_afect
                                from entregas
                                         inner join entregas_detalle
                                                    on entregas.ano = entregas_detalle.ano and entregas.numero = entregas_detalle.numero
                                WHERE entregas.ano = ?
                                  and entregas.numero = ?
                                  and entregas.requisicion = ?) entregas
                               on entregas.ano = requisicion_detalles.ano
                                   and entregas.requisicion = requisicion_detalles.numero
                                   and entregas.consecutivo_afect = requisicion_detalles.consecutivo
                     inner join catalogo
                                on catalogo.id = requisicion_detalles.id_producto
            where requisicion_detalles.ano = ?
              and requisicion_detalles.numero = ?
              and entregas.ano is null
                    `;
        const [result] = await pool.query(query, [ano, numero, requisicion,ano, requisicion]);
        res.json(result);
    } catch (error) {
        console.error("Error in getRequisicionesConSaldo:", error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    getRequisionDet,
    addRequisionesDet,
    updateRequisionesDet,
    deleteRequisionesDet,
    getReqDetalleConSaldo


};
