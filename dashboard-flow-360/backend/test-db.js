const { poolPromise } = require('./config/db');

async function test() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT 1 as val');
        console.log('Test Query Result:', result.recordset[0]);

        // Check if tables exist
        const tables = await pool.request().query("SELECT name FROM sys.tables");
        console.log('Tables:', tables.recordset.map(t => t.name));

        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

test();
