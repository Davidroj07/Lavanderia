import pool from "../database/database.js";

const getMenus = async (req, res) => {
    const { usuario, compania } = req.query; // Obtener los parámetros desde la consulta

    try {
        const query = `
            SELECT 
                mb.block_id, 
                mb.block_name, 
                mi.item_id, 
                mi.item_name, 
                mi.item_icon, 
                mi.item_link, 
                si.submenu_id, 
                si.submenu_name, 
                si.submenu_link
            FROM 
                menu_blocks mb
            LEFT JOIN 
                menu_items mi ON mb.block_id = mi.block_id
            LEFT JOIN 
                submenu_items si ON mi.item_id = si.item_id
            WHERE 
                mb.block_order > 0
            ORDER BY 
                mb.block_order, 
                mi.item_order, 
                si.submenu_order
        `;
        const [result] = await pool.query(query);
        res.json(result); // Devuelve los resultados en formato JSON
    } catch (error) {
        console.error("Error in getMenus:", error.message);
        res.status(500).send(error.message);
    }
};



export const methods = {
    getMenus,
};
