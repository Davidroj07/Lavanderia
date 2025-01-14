import pool from "../database/database.js";

const getSucursales = async (req, res) => {
    try {
        const query = "select id, nombre, nombre_completo, nit, direccion, telefono, ciudad from sucursal;";
        const [result] = await pool.query(query); // Ejecuta la consulta
        res.json(result); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        res.status(500).send(error.message);
    }
};

const addSucursales = async (req, res) => {
    try {
        const { id, nombre, nombreCompleto, nit, direccion, telefono, ciudad } = req.body;

        const query = `
            INSERT INTO sucursal (id, nombre, nombre_completo, nit, direccion, telefono, ciudad) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [id, nombre, nombreCompleto, nit, direccion, telefono, ciudad]);
        res.json({ success: true, message: "User added successfully" });
    } catch (error) {
        console.error("Error in addUser:", error.message);
        res.status(500).send(error.message);
    }
};

const updateSucursal = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE sucursal SET ${fields} WHERE id = ?`;
        await pool.query(query, [...values, id]);

        res.json({ success: true, message: 'Sucursal actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateSucursal:', error.message);
        res.status(500).send(error.message);
    }
};


const deleteSucursal = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID de los parámetros de la solicitud

        if (!id) {
            return res.status(400).json({ success: false, message: "El ID es obligatorio" });
        }

        const query = "DELETE FROM sucursal WHERE id = ?;";
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
    getSucursales,
    addSucursales,
    updateSucursal,
    deleteSucursal,


};
