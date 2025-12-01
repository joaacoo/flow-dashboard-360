console.log('🚀🚀🚀 INDEX.JS STARTING 🚀🚀🚀');
console.log('Starting index.js...');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const rulesEngine = require('./jobs/rulesEngine');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4012; // Usar puerto 4012

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const stockRoutes = require('./routes/stockRoutes');
const cobranzasRoutes = require('./routes/cobranzasRoutes');
const reglasRoutes = require('./routes/reglasRoutes');
const crmRoutes = require('./routes/crmRoutes');
const produccionRoutes = require('./routes/produccionRoutes');
const logisticaRoutes = require('./routes/logisticaRoutes');
const tangoRoutes = require('./routes/tangoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/collections', cobranzasRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reglas', reglasRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/produccion', produccionRoutes);
app.use('/api/logistica', logisticaRoutes);
app.use('/api/tango', tangoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Dashboard FLOW 360° API Running');
});

// Start Server
console.log('Attempting to start server on port', PORT);
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor Dashboard FLOW 360° ejecutándose en el puerto ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
});

server.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`⚠️  El puerto ${PORT} ya está en uso!`);
    console.error('💡 Solución: Cierra la aplicación que está usando el puerto o cambia el PORT en .env');
  }
  process.exit(1);
});

// Initialize Jobs
// Run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Running Rules Engine Job...');
  rulesEngine.execute();
});
