import { useState } from 'react';
import { DollarSign, AlertTriangle, Send, FileText, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Cobranzas = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        cliente: '',
        monto: '',
        fecha: '',
        metodo: 'transferencia',
        referencia: ''
    });
    // Datos para el aging report
    const agingData = [
        { categoria: 'Al día', monto: 125000 },
        { categoria: '30 días', monto: 85000 },
        { categoria: '60 días', monto: 45000 },
        { categoria: '90+ días', monto: 28000 },
    ];

    const topDeudores = [
        { id: 1, cliente: 'Empresa ABC', monto: 45000, diasAtraso: 15, contacto: 'contacto@abc.com' },
        { id: 2, cliente: 'Comercio XYZ', monto: 38000, diasAtraso: 45, contacto: 'info@xyz.com' },
        { id: 3, cliente: 'Industria DEF', monto: 28000, diasAtraso: 90, contacto: 'ventas@def.com' },
        { id: 4, cliente: 'Tienda GHI', monto: 22000, diasAtraso: 30, contacto: 'compras@ghi.com' },
        { id: 5, cliente: 'Mayorista JKL', monto: 18000, diasAtraso: 60, contacto: 'admin@jkl.com' },
    ];

    const totalACobrar = agingData.reduce((sum, item) => sum + item.monto, 0);
    const deudaVencida = agingData.filter(item => item.categoria !== 'Al día').reduce((sum, item) => sum + item.monto, 0);

    const getColorAtraso = (dias) => {
        if (dias >= 90) return 'text-red-600 dark:text-red-400';
        if (dias >= 60) return 'text-orange-600 dark:text-orange-400';
        if (dias >= 30) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-green-600 dark:text-green-400';
    };

    const getBadgeAtraso = (dias) => {
        if (dias >= 90) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Crítico</span>;
        if (dias >= 60) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Alto</span>;
        if (dias >= 30) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medio</span>;
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Bajo</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Cobranzas</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Gestión de cuentas por cobrar y seguimiento de deuda</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            const deudoresVencidos = topDeudores.filter(d => d.diasAtraso >= 30);
                            if (deudoresVencidos.length === 0) {
                                alert('No hay deudores vencidos para enviar recordatorios');
                                return;
                            }
                            if (confirm(`¿Enviar recordatorios a ${deudoresVencidos.length} cliente(s) con deuda vencida?`)) {
                                console.log('Enviando recordatorios a:', deudoresVencidos);
                                alert(`Recordatorios enviados a ${deudoresVencidos.length} cliente(s)`);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                    >
                        <Send size={20} />
                        Enviar Recordatorios
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} />
                        Registrar Pago
                    </button>
                </div>
            </div>

            {/* Resumen Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Total a Cobrar</p>
                            <p className="text-5xl font-bold text-slate-800 dark:text-white">${totalACobrar.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <DollarSign className="text-slate-600 dark:text-slate-300" size={40} />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={() => {
                                // Mostrar detalle en un modal o nueva vista
                                const detalle = `Total a Cobrar: $${totalACobrar.toLocaleString()}\n\nDesglose:\n${agingData.map(a => `- ${a.categoria}: $${a.monto.toLocaleString()}`).join('\n')}\n\nDeuda Vencida: $${deudaVencida.toLocaleString()}`;
                                alert(detalle);
                            }}
                            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium border border-slate-200 dark:border-slate-600"
                        >
                            Ver Detalle
                        </button>
                        <button 
                            onClick={() => {
                                // Exportar a CSV
                                const csvContent = [
                                    ['Categoría', 'Monto'].join(','),
                                    ...agingData.map(a => [a.categoria, a.monto].join(','))
                                ].join('\n');
                                
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `cobranzas_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium border border-slate-200 dark:border-slate-600"
                        >
                            Exportar
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                            <AlertTriangle className="text-red-600 dark:text-red-300" size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Deuda Vencida</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">${deudaVencida.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">30 días</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">${agingData[1].monto.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">60 días</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">${agingData[2].monto.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">90+ días</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">${agingData[3].monto.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico de Aging Report */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Aging Report - Antigüedad de la Deuda</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={agingData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="categoria" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                formatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Bar dataKey="monto" fill="#6366f1" name="Monto" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabla de Top Deudores */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Top 5 Clientes Deudores</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Monto Adeudado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Días de Atraso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Prioridad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {topDeudores.map(deudor => (
                                <tr key={deudor.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{deudor.cliente}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{deudor.contacto}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400">${deudor.monto.toLocaleString()}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getColorAtraso(deudor.diasAtraso)}`}>
                                        {deudor.diasAtraso} días
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getBadgeAtraso(deudor.diasAtraso)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                                        >
                                            Registrar Pago
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Registrar Pago */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Registrar Pago</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await api.post('/collections/pago', formData);
                                alert('Pago registrado exitosamente');
                                setIsModalOpen(false);
                                setFormData({ cliente: '', monto: '', fecha: '', metodo: 'transferencia', referencia: '' });
                            } catch (error) {
                                alert('Error al registrar pago: ' + (error.response?.data?.message || error.message));
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Cliente
                                </label>
                                <input
                                    type="text"
                                    value={formData.cliente}
                                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Nombre del cliente"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Monto
                                </label>
                                <input
                                    type="number"
                                    value={formData.monto}
                                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Fecha de Pago
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Método de Pago
                                </label>
                                <select
                                    value={formData.metodo}
                                    onChange={(e) => setFormData({ ...formData, metodo: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                >
                                    <option value="transferencia">Transferencia Bancaria</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="tarjeta">Tarjeta</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Referencia / Número de Comprobante
                                </label>
                                <input
                                    type="text"
                                    value={formData.referencia}
                                    onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Número de referencia"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Registrar Pago
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cobranzas;
