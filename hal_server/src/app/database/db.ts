import {Pool} from "pg";


const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    })

pool.on("connect", (conn) => {
        // @ts-expect-error iii909
        console.log('database connected', (conn as unknown).connectionParameters)
})

export default pool;