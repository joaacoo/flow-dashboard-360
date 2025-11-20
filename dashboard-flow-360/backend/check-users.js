const { poolPromise } = require('./config/db');

async function checkUsers() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id, nombre, email, password FROM usuarios');
        console.log('Users found:', result.recordset);
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
}

checkUsers();
