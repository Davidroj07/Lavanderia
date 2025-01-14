import pool from "../database/database.js";

const getUsers = async (req, res) => {
    try {
        const query = "SELECT compania, usuario, nombre, password, estado, nivel FROM users";
        const [result] = await pool.query(query); // Ejecuta la consulta
        res.json(result); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        res.status(500).send(error.message);
    }
};

const getUser = async (req, res) => {
    try {
        const { usuario } = req.params;
        const query = `
            SELECT compania, usuario, nombre, password, estado, nivel 
            FROM users 
            WHERE usuario = ?
        `;
        const [result] = await pool.query(query, [usuario]); // Usa destructuración para obtener filas
        res.json(result);
    } catch (error) {
        console.error("Error in getUser:", error.message);
        res.status(500).send(error.message);
    }
};

const addUser = async (req, res) => {
    try {
        const { compania, usuario, nombre, password, estado, nivel } = req.body;

        const query = `
            INSERT INTO users (compania, usuario, nombre, password, estado, nivel) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [compania, usuario, nombre, password, estado, nivel]);
        res.json({ success: true, message: "User added successfully" });
    } catch (error) {
        console.error("Error in addUser:", error.message);
        res.status(500).send(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const { usuario } = req.params;
        const updates = req.body;

        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const compania = "001";
        console.log(fields)

        const query = `UPDATE users SET ${fields} WHERE compania = ? AND usuario = ?`;
        await pool.query(query, [...values,compania, usuario]);

        res.json({ success: true, message: 'Usuario actualizada correctamente.' });
    } catch (error) {
        console.error('Error en updateUsuario:', error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser
};
