import pool from "../database/database.js"; // Importamos el pool de conexiones

const getTransaction = async (req, res) => {
    try {
        const { phone } = req.params; // Obtener el número de teléfono de los parámetros de la solicitud

        // Crear el query para obtener las transacciones
        const query = `
            SELECT ROW_NUMBER() OVER (ORDER BY idtransaction) AS id, 
                   phone, 
                   operacion, 
                   moneda, 
                   inversion, 
                   ganancia
            FROM transaction
            WHERE phone = ?
            ORDER BY idtransaction;
        `;

        // Ejecutar la consulta utilizando el pool
        const [result] = await pool.query(query, [phone]);

        // Enviar el resultado como respuesta
        res.json(result);
    } catch (error) {
        console.error("Error in getTransaction:", error.message);
        res.status(500).send(error.message);
    }
};

const addTransaction = async (req, res) => {
    try {
        const { phone, operacion, moneda, inversion, ganancia } = req.body;

        // Validar que todos los datos necesarios estén presentes
        if (!phone || !operacion || !moneda || typeof inversion === "undefined" || typeof ganancia === "undefined") {
            res.status(400).send("All fields are required");
            return;
        }

        // Query explícito para agregar una transacción
        const query = `
            INSERT INTO transaction (phone, operacion, moneda, inversion, ganancia) 
            VALUES (?, ?, ?, ?, ?)
        `;

        // Ejecutar la consulta utilizando el pool
        await pool.query(query, [phone, operacion, moneda, inversion, ganancia]);

        res.json({ success: true, message: "Transaction added successfully" });
    } catch (error) {
        console.error("Error in addTransaction:", error.message);
        res.status(500).send(error.message);
    }
};

export const methods = {
    addTransaction,
    getTransaction
};
