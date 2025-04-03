import pool from "../lib/db.js";

export const dbInteraction = async (tableName) => {

    try {
        const result = await pool.query('SELECT * FROM ' + tableName)
        console.log(tableName+" select call")
        return result.rows
    } catch (error) {
        console.log(error)
        return []
    }

}