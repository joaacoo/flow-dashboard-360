import { useState, useEffect } from 'react';
import { Settings, Plus, Power, Edit, Trash2, X } from 'lucide-react';
import api from '../services/api';

const Reglas = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRule, setNewRule] = useState({
        nombre: '',
        trigger: '',
        condition: '',
        action: '',
        descripcion: ''
    });

    const [editingRule, setEditingRule] = useState(null);
    const [reglas, setReglas] = useState([]);

    useEffect(() => {
        const fetchReglas = async () => {
            try {
                const { data } = await api.get('/reglas');
                // Transformar datos de la API al formato del frontend
                setReglas(data.map(r => ({
                    id: r.id,
                    nombre: r.nombre,
                    trigger: JSON.parse(r.condicion || '{}').trigger || '',
                    condition: JSON.parse(r.condicion || '{}').condition || '',
                    action: r.accion,
                    activa: r.activo,
                    descripcion: r.nombre
                })));
            } catch (error) {
                console.error('Error al cargar reglas:', error);
            }
        };
        fetchReglas();
    }, []);

    const triggers = [
        { value: 'stock_bajo', label: 'Stock bajo mínimo' },
        { value: 'venta_mayor', label: 'Venta supera monto' },
        { value: 'pago_vencido', label: 'Pago vencido' },
        { value: 'nuevo_lead', label: 'Nuevo lead ingresado' },
        { value: 'pedido_creado', label: 'Pedido creado' }
    ];

    const conditions = [
        { value: 'cantidad_menor_minimo', label: 'Cantidad menor al mínimo' },
        { value: 'monto_mayor_50000', label: 'Monto mayor a $50,000' },
        { value: 'dias_vencido_mayor_30', label: 'Más de 30 días vencido' },
        { value: 'zona_capital', label: 'Zona: Capital Federal' },
        { value: 'prioridad_alta', label: 'Prioridad: Alta' }
    ];

    const actions = [
        { value: 'enviar_email', label: 'Enviar email al administrador' },
        { value: 'aplicar_descuento_10', label: 'Aplicar 10% de descuento' },
        { value: 'enviar_recordatorio', label: 'Enviar recordatorio' },
        { value: 'asignar_vendedor_1', label: 'Asignar a Vendedor 1' },
        { value: 'crear_tarea', label: 'Crear tarea pendiente' }
    ];

    const toggleRegla = async (id) => {
        try {
            await api.patch(`/reglas/${id}/toggle`);
            setReglas(reglas.map(regla =>
                regla.id === id ? { ...regla, activa: !regla.activa } : regla
            ));
        } catch (error) {
            console.error('Error al cambiar estado de regla:', error);
            alert('Error al cambiar estado de la regla');
        }
    };

    const deleteRegla = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta regla?')) {
            try {
                await api.delete(`/reglas/${id}`);
                setReglas(reglas.filter(regla => regla.id !== id));
            } catch (error) {
                console.error('Error al eliminar regla:', error);
                alert('Error al eliminar la regla');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Reglas de Negocio</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Automatiza procesos con reglas personalizadas</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    Nueva Regla
                </button>
            </div>


            {/* Modal Nueva Regla */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Settings className="text-indigo-600 dark:text-indigo-400" size={24} />
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {editingRule ? 'Editar Regla de Negocio' : 'Nueva Regla de Negocio'}
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingRule(null);
                                    setNewRule({ nombre: '', trigger: '', condition: '', action: '', descripcion: '' });
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (newRule.trigger && newRule.condition && newRule.action) {
                                try {
                                    const ruleData = {
                                        nombre: newRule.nombre || `Regla ${reglas.length + 1}`,
                                        condicion: JSON.stringify({ trigger: newRule.trigger, condition: newRule.condition }),
                                        accion: newRule.action
                                    };

                                    if (editingRule) {
                                        await api.put(`/reglas/${editingRule.id}`, ruleData);
                                        alert('Regla actualizada exitosamente');
                                    } else {
                                        await api.post('/reglas', ruleData);
                                        alert('Regla creada exitosamente');
                                    }

                                    // Recargar reglas
                                    const { data } = await api.get('/reglas');
                                    setReglas(data.map(r => ({
                                        id: r.id,
                                        nombre: r.nombre,
                                        trigger: JSON.parse(r.condicion || '{}').trigger || '',
                                        condition: JSON.parse(r.condicion || '{}').condition || '',
                                        action: r.accion,
                                        activa: r.activo,
                                        descripcion: r.nombre
                                    })));

                                    setNewRule({ nombre: '', trigger: '', condition: '', action: '', descripcion: '' });
                                    setEditingRule(null);
                                    setIsModalOpen(false);
                                } catch (error) {
                                    alert('Error: ' + (error.response?.data?.message || error.message));
                                }
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre de la Regla
                                </label>
                                <input
                                    type="text"
                                    value={newRule.nombre}
                                    onChange={(e) => setNewRule({ ...newRule, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Ej: Alerta de Stock Bajo"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Si ocurre... (Trigger)
                                    </label>
                                    <select
                                        value={newRule.trigger}
                                        onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Seleccionar evento...</option>
                                        {triggers.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Verificar... (Condición)
                                    </label>
                                    <select
                                        value={newRule.condition}
                                        onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Seleccionar condición...</option>
                                        {conditions.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Entonces... (Acción)
                                    </label>
                                    <select
                                        value={newRule.action}
                                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Seleccionar acción...</option>
                                        {actions.map(a => (
                                            <option key={a.value} value={a.value}>{a.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    value={newRule.descripcion}
                                    onChange={(e) => setNewRule({ ...newRule, descripcion: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Descripción detallada de la regla..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingRule(null);
                                        setNewRule({ nombre: '', trigger: '', condition: '', action: '', descripcion: '' });
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newRule.trigger || !newRule.condition || !newRule.action}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-slate-400 disabled:cursor-not-allowed"
                                >
                                    {editingRule ? 'Guardar Cambios' : 'Crear Regla'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de Reglas Existentes */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Reglas Activas</h2>

                <div className="space-y-4">
                    {reglas.map(regla => (
                        <div
                            key={regla.id}
                            className={`p-4 rounded-lg border-2 transition-all ${regla.activa
                                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{regla.nombre}</h3>
                                        {regla.activa ? (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                Activa
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300">
                                                Inactiva
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{regla.descripcion}</p>

                                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 rounded">
                                            {triggers.find(t => t.value === regla.trigger)?.label}
                                        </span>
                                        <span>→</span>
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded">
                                            {conditions.find(c => c.value === regla.condition)?.label}
                                        </span>
                                        <span>→</span>
                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">
                                            {actions.find(a => a.value === regla.action)?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => toggleRegla(regla.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${regla.activa ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${regla.activa ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingRule(regla);
                                            setNewRule({
                                                nombre: regla.nombre,
                                                trigger: regla.trigger,
                                                condition: regla.condition,
                                                action: regla.action,
                                                descripcion: regla.descripcion
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded transition-colors"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>

                                    <button
                                        onClick={() => deleteRegla(regla.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reglas;
