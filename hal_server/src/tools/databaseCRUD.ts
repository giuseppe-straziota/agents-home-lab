import pool from "@/database/db";

export const readFromTable = async (tableName: string) => {

    try {
        const result = await pool.query('SELECT * FROM ' + tableName)
        console.log(tableName+" select call")
        return result.rows
    } catch (error) {
        console.log(error)
        return []
    }

}