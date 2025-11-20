const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const rulesEngine = require('./jobs/rulesEngine');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4010;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ventas', require('./routes/ventasRoutes'));
app.use('/api/collections', require('./routes/cobranzasRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/reglas', require('./routes/reglasRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Dashboard FLOW 360° API Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Servidor Dashboard FLOW 360° ejecutándose en el puerto ${PORT}`);
});

// Initialize Jobs
// Run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  console.log('Running Rules Engine Job...');
  rulesEngine.execute();
});
