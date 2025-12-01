import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw, Database, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const Tango = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [syncStatus, setSyncStatus] = useState({
        products: { status: 'idle', message: '' },
        clients: { status: 'idle', message: '' }
    });

    const fetchLogs = async () => {
        try {
            const { data } = await api.get('/tango/logs');
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 10000); // Poll logs every 10s
        return () => clearInterval(interval);
    }, []);

    const handleSync = async (type) => {
        setLoading(true);
        setSyncStatus(prev => ({ ...prev, [type]: { status: 'syncing', message: 'Sincronizando...' } }));

        try {
            const endpoint = type === 'products' ? '/tango/sync/products' : '/tango/sync/clients';
            const { data } = await api.post(endpoint);

            setSyncStatus(prev => ({
                ...prev,
                [type]: { status: 'success', message: `Sincronizados: ${data.count}` }
            }));
            fetchLogs();
        } catch (error) {
            setSyncStatus(prev => ({
                ...prev,
                [type]: { status: 'error', message: 'Error en sincronización' }
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <Database className="w-8 h-8 text-blue-600" />
                    Integración Tango Gestión
                </h1>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Conectado
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Productos */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Productos (STA11)</h3>
                            <p className="text-sm text-gray-500">Sincroniza catálogo y stock</p>
                        </div>
                        <div className={`p-2 rounded-full ${syncStatus.products.status === 'syncing' ? 'bg-blue-100 text-blue-600 animate-spin' : 'bg-gray-100 text-gray-600'}`}>
                            <RefreshCw size={20} />
                        </div>
                    </div>

                    <div className="mb-6">
                        {syncStatus.products.status === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
                                <CheckCircle size={16} /> {syncStatus.products.message}
                            </div>
                        )}
                        {syncStatus.products.status === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                                <AlertTriangle size={16} /> {syncStatus.products.message}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => handleSync('products')}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading && syncStatus.products.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar Ahora'}
                    </button>
                </div>

                {/* Card Clientes */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Clientes (GVA14)</h3>
                            <p className="text-sm text-gray-500">Sincroniza base de clientes</p>
                        </div>
                        <div className={`p-2 rounded-full ${syncStatus.clients.status === 'syncing' ? 'bg-blue-100 text-blue-600 animate-spin' : 'bg-gray-100 text-gray-600'}`}>
                            <RefreshCw size={20} />
                        </div>
                    </div>

                    <div className="mb-6">
                        {syncStatus.clients.status === 'success' && (
                            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
                                <CheckCircle size={16} /> {syncStatus.clients.message}
                            </div>
                        )}
                        {syncStatus.clients.status === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                                <AlertTriangle size={16} /> {syncStatus.clients.message}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => handleSync('clients')}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading && syncStatus.clients.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar Ahora'}
                    </button>
                </div>
            </div>

            {/* Logs Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Clock size={18} /> Historial de Sincronización
                    </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Mensaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {log.sync_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                            log.status === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{log.items_processed}</td>
                                    <td className="px-6 py-4 text-gray-500">{log.message}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No hay registros de sincronización
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tango;
