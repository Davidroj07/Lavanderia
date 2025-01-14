import mysql from "mysql2/promise"; // Usa mysql2/promise para trabajar con promesas

import config from "../config.js"; // Asegúrate de que config.js tenga los datos correctos

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10, // Límite de conexiones simultáneas
    queueLimit: 0 // Sin límite en la cola de conexiones
});

export default pool; // Exportar el pool para usarlo en otros módulos
