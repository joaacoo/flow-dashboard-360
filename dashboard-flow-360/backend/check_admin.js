const poolPromise = require('./config/db');
const sql = require('mssql');
const fs = require('fs');

async function check() {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query("SELECT * FROM usuarios WHERE email = 'admin@flow360.com'");

        if (result.recordset.length > 0) {
            fs.writeFileSync('admin_status.txt', 'EXISTS');
        } else {
            fs.writeFileSync('admin_status.txt', 'MISSING');
        }
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('admin_status.txt', 'ERROR: ' + e.message);
        process.exit(1);
    }
}
check();
