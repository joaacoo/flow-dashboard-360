const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
    email: 'admin@flow360.com',
    password: 'admin123'
});

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

console.log('🚀 Enviando petición de login a http://localhost:4012/api/auth/login...');

const req = http.request(options, (res) => {
    console.log(`📡 Estado de respuesta: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('📄 Respuesta del servidor:');
        console.log(body);
        fs.writeFileSync('result.txt', 'Status: ' + res.statusCode + '\nBody: ' + body);
    });
});

req.on('error', (error) => {
    console.error('❌ Error de conexión:', error.message);
    fs.writeFileSync('result.txt', 'Error: ' + error.message);
});

req.write(data);
req.end();
