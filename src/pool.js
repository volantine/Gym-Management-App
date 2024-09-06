import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: '3005project',
    password: 'student',
    port: 5433
});

export default pool;