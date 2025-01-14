import pool from "../database/database.js";

const getCatalogo = async (req, res) => {
    try {
        const query = "select id, producto, descripcion from catalogo;";
        const [result] = await pool.query(query); // Ejecuta la consulta
        res.json(result); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        res.status(500).send(error.message);
    }
};

const addcatalogo = async (req, res) => {
    try {
        const { id, producto, descripcion } = req.body;

        const query = `
            INSERT INTO catalogo (id, producto, descripcion) 
            VALUES (?, ?, ?)
        `;
        await pool.query(query, [id, producto, descripcion]);
        res.json({ success: true, message: "User added successfully" });
    } catch (error) {
        console.error("Error in addUser:", error.message);
        res.status(500).send(error.message);
    }
};

const updateCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE catalogo SET ${fields} WHERE id = ?`;
        await pool.query(query, [...values, id]);

        res.json({ success: true, message: 'Sucursal actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateSucursal:', error.message);
        res.status(500).send(error.message);
    }
};


const deleteCatalogo = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de los parámetros de la solicitud

        if (!id) {
            return res.status(400).json({ success: false, message: "El ID es obligatorio" });
        }

        const query = "DELETE FROM catalogo WHERE id = ?;";
        const [result] = await pool.query(query, [id]); // Ejecuta la consulta con el ID

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Sucursal eliminada correctamente" });
        } else {
            res.status(404).json({ success: false, message: "Sucursal no encontrada" });
        }
    } catch (error) {
        console.error("Error in deleteSucursal:", error.message);
        res.status(500).send(error.message);
    }
};


export const methods = {
    getCatalogo,
    addcatalogo,
    updateCatalogo,
    deleteCatalogo,


};
