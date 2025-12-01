const tangoService = require('../services/tangoService');

const syncProducts = async (req, res) => {
    try {
        const result = await tangoService.syncProducts();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error syncing products', error: error.message });
    }
};

const syncClients = async (req, res) => {
    try {
        const result = await tangoService.syncClients();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error syncing clients', error: error.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await tangoService.getLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

module.exports = { syncProducts, syncClients, getLogs };
