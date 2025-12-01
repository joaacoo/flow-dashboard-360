// start.js - Ejecuta esto con: node start.js
// Inicia automáticamente el backend y frontend del Dashboard FLOW 360°

const { spawn } = require('child_process');
const path = require('path');

console.log('═══════════════════════════════════════════════════════');
console.log('🚀 Iniciando Dashboard FLOW 360°...');
console.log('═══════════════════════════════════════════════════════\n');

// Definir rutas absolutas para evitar problemas con el PATH del sistema
const NODE_PATH = 'C:\\Program Files\\nodejs\\node.exe';
// Para npm (cmd), necesitamos comillas si usamos shell: true debido a los espacios
const NPM_PATH = '"C:\\Program Files\\nodejs\\npm.cmd"';

// Iniciar backend usando node directamente (shell: false es más seguro para .exe y maneja espacios)
console.log('📦 Iniciando Backend...');
const backend = spawn(NODE_PATH, ['index.js'], {
    cwd: path.join(__dirname, 'backend'),
    shell: false,
    stdio: 'inherit'
});

// Esperar un momento antes de iniciar el frontend
setTimeout(() => {
    console.log('\n🎨 Iniciando Frontend...\n');
    // Para npm, usamos shell: true y el path entre comillas
    const frontend = spawn(NPM_PATH, ['run', 'dev'], {
        cwd: path.join(__dirname, 'frontend'),
        shell: true,
        stdio: 'inherit'
    });

    frontend.on('error', (error) => {
        console.error('❌ Error al iniciar el frontend:', error);
    });
}, 2000);

backend.on('error', (error) => {
    console.error('❌ Error al iniciar el backend:', error);
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('✅ Aplicación iniciada correctamente');
console.log('═══════════════════════════════════════════════════════');
console.log('📊 Frontend: http://localhost:5173');
console.log('🔧 Backend API: http://localhost:4012');
console.log('═══════════════════════════════════════════════════════');
console.log('\n💡 Presiona Ctrl+C para detener la aplicación\n');

// Manejar cierre limpio
process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo aplicación...');
    backend.kill();
    process.exit();
});
