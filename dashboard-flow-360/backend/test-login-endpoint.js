// Script para probar el login endpoint
const http = require('http');

function testLogin(email, password) {
    const data = JSON.stringify({ email, password });

    const options = {
        hostname: 'localhost',
        port: 4012,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log(`\n🔍 Probando login con: ${email}`);
    console.log(`📡 POST http://localhost:4012/api/auth/login\n`);

    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📦 Response:`, responseData);

            if (res.statusCode === 200) {
                console.log('\n✅ LOGIN EXITOSO!');
                const parsed = JSON.parse(responseData);
                console.log('👤 Usuario:', parsed.user);
                console.log('🔑 Token:', parsed.token.substring(0, 20) + '...');
            } else {
                console.log('\n❌ LOGIN FALLIDO');
                try {
                    const parsed = JSON.parse(responseData);
                    console.log('💬 Mensaje:', parsed.message);
                } catch (e) {
                    console.log('💬 Response:', responseData);
                }
            }
        });
    });

    req.on('error', (error) => {
        console.error('\n❌ Error de conexión:', error.message);
        console.error('\n💡 Posibles causas:');
        console.error('   - El backend no está ejecutándose');
        console.error('   - El backend está en un puerto diferente');
        console.error('   - Firewall bloqueando la conexión');
        console.error('\n🔧 Solución: Ejecuta "node start.js" desde la raíz del proyecto');
    });

    req.write(data);
    req.end();
}

// Probar con admin (debería funcionar con cualquier password debido al bypass)
console.log('═══════════════════════════════════════════════════════');
console.log('🧪 TEST DE LOGIN - Dashboard FLOW 360°');
console.log('═══════════════════════════════════════════════════════');

// Probar admin con diferentes passwords
testLogin('admin@flow360.com', 'cualquier_cosa');

setTimeout(() => {
    testLogin('admin@flow360.com', 'admin123');
}, 1500);

setTimeout(() => {
    testLogin('admin@flow360.com', '');
}, 3000);
