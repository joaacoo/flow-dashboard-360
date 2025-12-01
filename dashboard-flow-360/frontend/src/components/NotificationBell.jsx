import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle } from 'lucide-react';
import axios from 'axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Obtener notificaciones
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4012/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotifications(response.data.notificaciones || []);
            setUnreadCount(response.data.noLeidas || 0);
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
        }
    };

    // Cargar notificaciones al montar y cada 30 segundos
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Actualizar cada 30 segundos
        return () => clearInterval(interval);
    }, []);

    // Marcar como leída
    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:4012/api/notifications/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Actualizar localmente
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, leido: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    // Marcar todas como leídas
    const markAllAsRead = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.patch(
                'http://localhost:4012/api/notifications/read-all',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Actualizar localmente
            setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener icono según tipo
    const getIcon = (tipo) => {
        switch (tipo) {
            case 'error':
            case 'alerta':
                return <AlertCircle className="text-red-500" size={20} />;
            case 'exito':
            case 'success':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'info':
            default:
                return <Info className="text-blue-500" size={20} />;
        }
    };

    // Formatear tiempo transcurrido
    const formatTime = (minutos) => {
        if (minutos < 1) return 'Ahora';
        if (minutos < 60) return `Hace ${minutos}m`;
        const horas = Math.floor(minutos / 60);
        if (horas < 24) return `Hace ${horas}h`;
        const dias = Math.floor(horas / 24);
        return `Hace ${dias}d`;
    };

    return (
        <div className="relative">
            {/* Botón de campana */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-110"
                title="Notificaciones"
            >
                <Bell className="text-slate-600 dark:text-slate-300" size={24} />

                {/* Badge de contador */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panel de notificaciones */}
            {isOpen && (
                <>
                    {/* Overlay para cerrar */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">
                                    Notificaciones
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={loading}
                                        className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Marcar todas
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                >
                                    <X size={18} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Lista de notificaciones */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={48} />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        No hay notificaciones
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!notif.leido ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                }`}
                                            onClick={() => !notif.leido && markAsRead(notif.id)}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getIcon(notif.tipo)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-slate-800 dark:text-white font-medium">
                                                        {notif.mensaje}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {formatTime(notif.minutos_transcurridos)}
                                                        </span>

                                                        {!notif.leido && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                </div>

                                                {!notif.leido && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notif.id);
                                                        }}
                                                        className="flex-shrink-0 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                                                        title="Marcar como leída"
                                                    >
                                                        <Check size={16} className="text-slate-500 dark:text-slate-400" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
