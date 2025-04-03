import pkg from 'pg';
const { Pool } = pkg;

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'HomeAgents',
                password: 'postgres',
                port: 5432,
                // user: process.env.DB_USER,
                // host: process.env.DB_HOST,
                // database: process.env.DB_NAME,
                // password: process.env.DB_PASSWORD,
                // port: Number(process.env.DB_PORT),
            });
            console.log('new Pool created...');

            this.pool.on('connect', () => {
                console.log('Database connected');
            });

            Database.instance = this;
        }

        return Database.instance;
    }

    query(sql, params) {
        return this.pool.query(sql, params);
    }
}

const dbInstance = new Database();
Object.freeze(dbInstance);

export default dbInstance;