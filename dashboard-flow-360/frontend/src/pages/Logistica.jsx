import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Logistica = () => {
    const kpis = {
        entregasATiempo: 94.5,
        camionesDisponibles: 12,
        enviosEnCurso: 28
    };

    const envios = [
        {
            id: 1,
            pedido: '#PED-001',
            cliente: 'Empresa ABC',
            destino: 'Buenos Aires, CABA',
            estado: 'entregado',
            progreso: 100,
            demorado: false,
            etapas: [
                { nombre: 'Preparación', completado: true, fecha: '18/11 09:00' },
                { nombre: 'En Ruta', completado: true, fecha: '18/11 14:30' },
                { nombre: 'Entregado', completado: true, fecha: '18/11 18:45' }
            ]
        },
        {
            id: 2,
            pedido: '#PED-002',
            cliente: 'Comercio XYZ',
            destino: 'Córdoba Capital',
            estado: 'en_ruta',
            progreso: 66,
            demorado: false,
            etapas: [
                { nombre: 'Preparación', completado: true, fecha: '19/11 08:00' },
                { nombre: 'En Ruta', completado: true, fecha: '19/11 12:00' },
                { nombre: 'Entregado', completado: false, fecha: 'Estimado: 20/11' }
            ]
        },
        {
            id: 3,
            pedido: '#PED-003',
            cliente: 'Industria DEF',
            destino: 'Rosario, Santa Fe',
            estado: 'preparacion',
            progreso: 33,
            demorado: true,
            etapas: [
                { nombre: 'Preparación', completado: true, fecha: '17/11 10:00' },
                { nombre: 'En Ruta', completado: false, fecha: 'Pendiente' },
                { nombre: 'Entregado', completado: false, fecha: 'Demorado' }
            ]
        },
        {
            id: 4,
            pedido: '#PED-004',
            cliente: 'Tienda GHI',
            destino: 'Mendoza Capital',
            estado: 'en_ruta',
            progreso: 66,
            demorado: false,
            etapas: [
                { nombre: 'Preparación', completado: true, fecha: '19/11 07:30' },
                { nombre: 'En Ruta', completado: true, fecha: '19/11 11:00' },
                { nombre: 'Entregado', completado: false, fecha: 'Estimado: 20/11' }
            ]
        }
    ];

    const getEstadoBadge = (estado, demorado) => {
        if (demorado) {
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Demorado</span>;
        }
        switch (estado) {
            case 'entregado':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Entregado</span>;
            case 'en_ruta':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">En Ruta</span>;
            case 'preparacion':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Preparación</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Control de Logística</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Monitoreo en tiempo real de envíos y entregas</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <CheckCircle className="text-green-600 dark:text-green-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">% Entregas a Tiempo</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{kpis.entregasATiempo}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Truck className="text-blue-600 dark:text-blue-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Camiones Disponibles</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{kpis.camionesDisponibles}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <Package className="text-orange-600 dark:text-orange-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Envíos en Curso</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{kpis.enviosEnCurso}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Envíos */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Envíos en Curso</h2>
                    <div className="space-y-4">
                        {envios.map(envio => (
                            <div
                                key={envio.id}
                                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${envio.demorado
                                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{envio.pedido}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{envio.cliente}</p>
                                    </div>
                                    {getEstadoBadge(envio.estado, envio.demorado)}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    <MapPin size={16} />
                                    <span>{envio.destino}</span>
                                </div>

                                {/* Barra de progreso */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                        <span>Progreso</span>
                                        <span>{envio.progreso}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${envio.demorado ? 'bg-red-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${envio.progreso}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-2">
                                    {envio.etapas.map((etapa, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex flex-col items-center">
                                                {etapa.completado ? (
                                                    <CheckCircle className="text-green-500" size={20} />
                                                ) : (
                                                    <Clock className={`${envio.demorado ? 'text-red-500' : 'text-slate-400'}`} size={20} />
                                                )}
                                                {index < envio.etapas.length - 1 && (
                                                    <div className={`w-0.5 h-6 ${etapa.completado ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${etapa.completado ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {etapa.nombre}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{etapa.fecha}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ubicación de Camiones */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Ubicación de Camiones</h2>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg h-[600px] relative overflow-hidden">
                        {/* Mapa simulado con camiones */}
                        <div className="absolute inset-0 p-4">
                            {[
                                { id: 1, nombre: 'Camión 01', lat: '20%', lng: '30%', estado: 'En ruta', pedido: '#PED-002' },
                                { id: 2, nombre: 'Camión 02', lat: '60%', lng: '50%', estado: 'En ruta', pedido: '#PED-004' },
                                { id: 3, nombre: 'Camión 03', lat: '40%', lng: '70%', estado: 'Disponible', pedido: null },
                            ].map(camion => (
                                <div
                                    key={camion.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                                    style={{ left: camion.lng, top: camion.lat }}
                                >
                                    <div className={`p-2 rounded-lg shadow-lg ${camion.estado === 'En ruta' ? 'bg-indigo-500' : 'bg-green-500'}`}>
                                        <Truck className="text-white" size={24} />
                                    </div>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                                        <p className="font-semibold">{camion.nombre}</p>
                                        <p className="text-xs">{camion.estado}</p>
                                        {camion.pedido && <p className="text-xs mt-1">{camion.pedido}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                                    <span className="text-slate-700 dark:text-slate-300">En Ruta</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-slate-700 dark:text-slate-300">Disponible</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logistica;
