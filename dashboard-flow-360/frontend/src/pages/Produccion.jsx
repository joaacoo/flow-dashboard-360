import { Activity, AlertCircle, CheckCircle, Clock, Thermometer, Gauge } from 'lucide-react';

const Produccion = () => {
    const maquinas = [
        {
            id: 1,
            nombre: 'Extrusora A',
            estado: 'operativa',
            temperatura: 185,
            velocidad: 85,
            produccion: 1250,
            unidad: 'kg/h'
        },
        {
            id: 2,
            nombre: 'Inyectora B',
            estado: 'operativa',
            temperatura: 220,
            velocidad: 92,
            produccion: 850,
            unidad: 'pzas/h'
        },
        {
            id: 3,
            nombre: 'Mezcladora C',
            estado: 'alerta',
            temperatura: 95,
            velocidad: 65,
            produccion: 420,
            unidad: 'kg/h'
        },
        {
            id: 4,
            nombre: 'Empacadora D',
            estado: 'mantenimiento',
            temperatura: 0,
            velocidad: 0,
            produccion: 0,
            unidad: 'cajas/h'
        },
    ];

    const ordenesProduccion = [
        { id: 'OP-001', producto: 'Pieza Plástica A', avance: 85, inicio: '18/11', fin: '20/11' },
        { id: 'OP-002', producto: 'Componente B', avance: 60, inicio: '19/11', fin: '21/11' },
        { id: 'OP-003', producto: 'Envase C', avance: 30, inicio: '19/11', fin: '22/11' },
        { id: 'OP-004', producto: 'Tapa D', avance: 95, inicio: '17/11', fin: '19/11' },
    ];

    const getEstadoMaquina = (estado) => {
        switch (estado) {
            case 'operativa':
                return {
                    icon: <CheckCircle size={24} />,
                    color: 'text-green-500',
                    bg: 'bg-green-100 dark:bg-green-900',
                    border: 'border-green-500',
                    label: 'Operativa'
                };
            case 'alerta':
                return {
                    icon: <AlertCircle size={24} />,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-100 dark:bg-yellow-900',
                    border: 'border-yellow-500',
                    label: 'Alerta'
                };
            case 'mantenimiento':
                return {
                    icon: <Activity size={24} />,
                    color: 'text-red-500',
                    bg: 'bg-red-100 dark:bg-red-900',
                    border: 'border-red-500',
                    label: 'Mantenimiento'
                };
            default:
                return {
                    icon: <Clock size={24} />,
                    color: 'text-slate-500',
                    bg: 'bg-slate-100',
                    border: 'border-slate-500',
                    label: 'Detenida'
                };
        }
    };

    const getColorAvance = (avance) => {
        if (avance >= 80) return 'bg-green-500';
        if (avance >= 50) return 'bg-blue-500';
        if (avance >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Producción</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Monitoreo en tiempo real de planta industrial</p>
            </div>

            {/* Estado de Máquinas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {maquinas.map(maquina => {
                    const estadoInfo = getEstadoMaquina(maquina.estado);
                    return (
                        <div
                            key={maquina.id}
                            className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 ${estadoInfo.border} transition-all hover:shadow-lg`}
                        >
                            {/* Header de la tarjeta */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 dark:text-white">{maquina.nombre}</h3>
                                <div className={`p-2 ${estadoInfo.bg} rounded-lg ${estadoInfo.color}`}>
                                    {estadoInfo.icon}
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="mb-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${estadoInfo.bg} ${estadoInfo.color}`}>
                                    {estadoInfo.label}
                                </span>
                            </div>

                            {/* Métricas */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="text-slate-400" size={18} />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Temperatura:</span>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{maquina.temperatura}°C</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Gauge className="text-slate-400" size={18} />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Velocidad:</span>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{maquina.velocidad}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="text-slate-400" size={18} />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Producción:</span>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{maquina.produccion} {maquina.unidad}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Órdenes de Producción */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Órdenes de Producción en Curso</h2>

                <div className="space-y-6">
                    {ordenesProduccion.map(orden => (
                        <div key={orden.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white">{orden.id} - {orden.producto}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Inicio: {orden.inicio} | Fin estimado: {orden.fin}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{orden.avance}%</span>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-full ${getColorAvance(orden.avance)} transition-all duration-500 flex items-center justify-end pr-2`}
                                    style={{ width: `${orden.avance}%` }}
                                >
                                    <span className="text-xs font-semibold text-white">{orden.avance}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resumen de Producción */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <CheckCircle className="text-green-600 dark:text-green-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Máquinas Operativas</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">2/4</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Activity className="text-blue-600 dark:text-blue-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Órdenes Activas</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">4</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Gauge className="text-orange-600 dark:text-orange-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Eficiencia Promedio</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">78%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Produccion;
