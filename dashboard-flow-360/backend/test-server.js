const express = require('express');
const app = express();
const PORT = 4012;

console.log('🚀 Starting minimal test server...');

app.get('/', (req, res) => {
    res.send('Minimal server working');
});

const server = app.listen(PORT, () => {
    console.log(`✅ Minimal server listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
});

// Keep alive just in case
setInterval(() => {
    console.log('💓 Heartbeat');
}, 5000);
