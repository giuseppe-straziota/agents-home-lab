import pkg from 'pg';
const {Pool} = pkg;


 const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'HomeAgents',
        password: 'postgres',
        port: Number(5432),
        // user: process.env.DB_USER,
        // host: process.env.DB_HOST,
        // database: process.env.DB_NAME,
        // password: process.env.DB_PASSWORD,
        // port: Number(process.env.DB_PORT),
    })
console.log('pool', pool)
pool.on("connect", (conn) => {
        console.log('database connected')
})

export default pool;