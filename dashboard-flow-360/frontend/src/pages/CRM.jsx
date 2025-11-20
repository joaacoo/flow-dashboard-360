import { useState } from 'react';
import { Users, DollarSign, TrendingUp, X, Plus } from 'lucide-react';

const CRM = () => {
    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        contacto: '',
        email: '',
        telefono: '',
        monto: '',
        prioridad: 'Media',
        estado: 'nuevos'
    });

    const columns = [
        { id: 'nuevos', title: 'Nuevos Leads', color: 'blue' },
        { id: 'negociacion', title: 'En Negociación', color: 'yellow' },
        { id: 'esperando', title: 'Esperando Pago', color: 'orange' },
        { id: 'cerrados', title: 'Cerrados', color: 'green' }
    ];

    const leads = {
        nuevos: [
            { id: 1, nombre: 'Empresa ABC', monto: 45000, prioridad: 'Alta', telefono: '+54 11 1234-5678', email: 'contacto@abc.com' },
            { id: 2, nombre: 'Comercio XYZ', monto: 28000, prioridad: 'Media', telefono: '+54 11 8765-4321', email: 'info@xyz.com' },
        ],
        negociacion: [
            { id: 3, nombre: 'Industria DEF', monto: 120000, prioridad: 'Alta', telefono: '+54 11 5555-1234', email: 'ventas@def.com' },
            { id: 4, nombre: 'Tienda GHI', monto: 35000, prioridad: 'Baja', telefono: '+54 11 4444-5678', email: 'compras@ghi.com' },
        ],
        esperando: [
            { id: 5, nombre: 'Mayorista JKL', monto: 85000, prioridad: 'Alta', telefono: '+54 11 3333-9999', email: 'admin@jkl.com' },
        ],
        cerrados: [
            { id: 6, nombre: 'Distribuidor MNO', monto: 95000, prioridad: 'Media', telefono: '+54 11 2222-7777', email: 'contacto@mno.com' },
            { id: 7, nombre: 'Retail PQR', monto: 52000, prioridad: 'Alta', telefono: '+54 11 1111-6666', email: 'ventas@pqr.com' },
        ]
    };

    const getPriorityColor = (prioridad) => {
        switch (prioridad) {
            case 'Alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'Media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Baja': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getColumnColor = (color) => {
        const colors = {
            blue: 'border-blue-500',
            yellow: 'border-yellow-500',
            orange: 'border-orange-500',
            green: 'border-green-500'
        };
        return colors[color] || 'border-gray-500';
    };

    const totalLeads = Object.values(leads).flat().length;
    const totalMonto = Object.values(leads).flat().reduce((sum, lead) => sum + lead.monto, 0);
    const tasaConversion = ((leads.cerrados.length / totalLeads) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">CRM - Pipeline de Ventas</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Gestiona tus leads y oportunidades de negocio</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Lead
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Users className="text-slate-600 dark:text-slate-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Leads</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalLeads}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <DollarSign className="text-green-600 dark:text-green-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Valor Total Pipeline</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">${totalMonto.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <TrendingUp className="text-purple-600 dark:text-purple-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Tasa de Conversión</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{tasaConversion}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map(column => (
                    <div key={column.id} className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                        <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${getColumnColor(column.color)}`}>
                            <h3 className="font-semibold text-slate-800 dark:text-white">{column.title}</h3>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {leads[column.id].length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {leads[column.id].map(lead => (
                                <div
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 cursor-pointer hover:shadow-md transition-all hover:scale-105"
                                >
                                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{lead.nombre}</h4>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                            ${lead.monto.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.prioridad)}`}>
                                            {lead.prioridad}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide-over Panel */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md h-full overflow-y-auto shadow-xl animate-slide-in">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Detalle del Lead</h2>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-slate-600 dark:text-slate-300" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{selectedLead.nombre}</h3>
                                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedLead.prioridad)}`}>
                                        Prioridad: {selectedLead.prioridad}
                                    </span>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monto Estimado</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">${selectedLead.monto.toLocaleString()}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Información de Contacto</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Email:</span>
                                            <span className="text-sm text-slate-800 dark:text-white">{selectedLead.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">Teléfono:</span>
                                            <span className="text-sm text-slate-800 dark:text-white">{selectedLead.telefono}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Historial de Actividad</h4>
                                    <div className="space-y-3">
                                        {[
                                            { fecha: '15/11/2024', accion: 'Llamada realizada', nota: 'Cliente interesado en productos premium' },
                                            { fecha: '10/11/2024', accion: 'Email enviado', nota: 'Propuesta comercial enviada' },
                                            { fecha: '05/11/2024', accion: 'Primer contacto', nota: 'Lead generado desde web' }
                                        ].map((actividad, index) => (
                                            <div key={index} className="border-l-2 border-indigo-500 pl-4 py-2">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-white">{actividad.accion}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{actividad.fecha}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{actividad.nota}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                        Agregar Nota
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                                        Mover Etapa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Nuevo Lead */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Lead</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Lead creado:', formData);
                            setIsModalOpen(false);
                            setFormData({
                                nombre: '',
                                contacto: '',
                                email: '',
                                telefono: '',
                                monto: '',
                                prioridad: 'Media',
                                estado: 'nuevos'
                            });
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre de la Empresa
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Nombre de la empresa"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Persona de Contacto
                                </label>
                                <input
                                    type="text"
                                    value={formData.contacto}
                                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Nombre del contacto"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="email@empresa.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="+54 11 1234-5678"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Monto Estimado
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.monto}
                                        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Prioridad
                                    </label>
                                    <select
                                        value={formData.prioridad}
                                        onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Estado Inicial
                                </label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                >
                                    <option value="nuevos">Nuevos Leads</option>
                                    <option value="negociacion">En Negociación</option>
                                    <option value="esperando">Esperando Pago</option>
                                </select>
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
                                    Crear Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRM;
