import { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icono personalizado para camiones
const truckIcon = (color) => L.divIcon({
    className: 'custom-truck-icon',
    html: `<div style="background-color: ${color}; padding: 8px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
      <path d="M15 18H9"></path>
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
      <circle cx="17" cy="18" r="2"></circle>
      <circle cx="7" cy="18" r="2"></circle>
    </svg>
  </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const Logistica = () => {
    const kpis = {
        entregasATiempo: 94.5,
        camionesDisponibles: 12,
        enviosEnCurso: 28
    };

    // Camiones con ubicaciones GPS reales en Argentina
    const [camiones, setCamiones] = useState([
        {
            id: 1,
            nombre: 'Camión 01',
            lat: -34.6037,
            lng: -58.3816, // Buenos Aires
            estado: 'En ruta',
            pedido: '#PED-002',
            destino: 'Córdoba Capital',
            velocidad: 85,
            conductor: 'Juan Pérez'
        },
        {
            id: 2,
            nombre: 'Camión 02',
            lat: -31.4201,
            lng: -64.1888, // Córdoba
            estado: 'En ruta',
            pedido: '#PED-004',
            destino: 'Mendoza Capital',
            velocidad: 90,
            conductor: 'María García'
        },
        {
            id: 3,
            nombre: 'Camión 03',
            lat: -32.9442,
            lng: -60.6505, // Rosario
            estado: 'Disponible',
            pedido: null,
            destino: 'En espera',
            velocidad: 0,
            conductor: 'Carlos López'
        },
        {
            id: 4,
            nombre: 'Camión 04',
            lat: -32.8895,
            lng: -68.8458, // Mendoza
            estado: 'En ruta',
            pedido: '#PED-005',
            destino: 'San Juan',
            velocidad: 75,
            conductor: 'Roberto Díaz'
        },
    ]);

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

    // Simular actualización de posición GPS cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCamiones(prev => prev.map(camion => {
                if (camion.estado === 'En ruta') {
                    // Mover ligeramente la posición (simulación de movimiento)
                    return {
                        ...camion,
                        lat: camion.lat + (Math.random() - 0.5) * 0.01,
                        lng: camion.lng + (Math.random() - 0.5) * 0.01,
                    };
                }
                return camion;
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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
                <p className="text-slate-600 dark:text-slate-400 mt-2">Monitoreo en tiempo real de envíos y entregas con GPS</p>
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

            {/* Mapa GPS Real */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Navigation className="text-blue-600" size={24} />
                    Rastreo GPS en Tiempo Real
                </h2>
                <div className="h-[600px] rounded-lg overflow-hidden">
                    <MapContainer
                        center={[-34.6037, -58.3816]}
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {camiones.map(camion => (
                            <Marker
                                key={camion.id}
                                position={[camion.lat, camion.lng]}
                                icon={truckIcon(camion.estado === 'En ruta' ? '#6366f1' : '#10b981')}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold text-lg">{camion.nombre}</h3>
                                        <p className="text-sm"><strong>Estado:</strong> {camion.estado}</p>
                                        <p className="text-sm"><strong>Conductor:</strong> {camion.conductor}</p>
                                        {camion.pedido && <p className="text-sm"><strong>Pedido:</strong> {camion.pedido}</p>}
                                        <p className="text-sm"><strong>Destino:</strong> {camion.destino}</p>
                                        <p className="text-sm"><strong>Velocidad:</strong> {camion.velocidad} km/h</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            GPS: {camion.lat.toFixed(4)}, {camion.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                        <span className="text-slate-700 dark:text-slate-300">En Ruta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-slate-700 dark:text-slate-300">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Navigation size={16} className="text-blue-600" />
                        <span className="text-slate-700 dark:text-slate-300">Actualización en tiempo real (cada 5s)</span>
                    </div>
                </div>
            </div>

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
        </div>
    );
};

export default Logistica;
