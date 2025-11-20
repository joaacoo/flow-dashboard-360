import { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();

    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('flowDarkMode');
        if (saved === 'true') return true;
        if (saved === 'false') return false;
        return document.documentElement.classList.contains('dark');
    });

    // Aplicar tema inmediatamente al montar
    useEffect(() => {
        const html = document.documentElement;
        const isDark = darkMode;
        
        // Forzar aplicación del tema
        if (isDark) {
            html.classList.add('dark');
            html.setAttribute('data-theme', 'dark');
        } else {
            html.classList.remove('dark');
            html.setAttribute('data-theme', 'light');
        }
        html.style.colorScheme = isDark ? 'dark' : 'light';
        document.body.className = isDark ? 'dark' : '';
        
        localStorage.setItem('flowDarkMode', String(isDark));
    }, [darkMode]);

    const toggleDarkMode = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setDarkMode(prev => {
            const newMode = !prev;
            // Aplicar inmediatamente sin esperar el useEffect
            const html = document.documentElement;
            if (newMode) {
                html.classList.add('dark');
                html.setAttribute('data-theme', 'dark');
                html.style.colorScheme = 'dark';
                document.body.classList.add('dark');
            } else {
                html.classList.remove('dark');
                html.setAttribute('data-theme', 'light');
                html.style.colorScheme = 'light';
                document.body.classList.remove('dark');
            }
            localStorage.setItem('flowDarkMode', String(newMode));
            return newMode;
        });
    };

    return (
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between transition-colors duration-300">
            {/* Botón de menú y Bienvenida */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-110"
                    title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
                >
                    <Menu size={24} className="text-slate-600 dark:text-slate-300" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center transition-colors duration-300">
                        <User className="text-slate-600 dark:text-slate-300" size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Bienvenido</p>
                        <p className="font-semibold text-slate-800 dark:text-white">{user?.nombre || 'Usuario'}</p>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-4">
                {/* Botón de modo oscuro/claro */}
                <button
                    onClick={toggleDarkMode}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                    title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    type="button"
                >
                    {darkMode ? (
                        <Sun className="text-yellow-500" size={24} />
                    ) : (
                        <Moon className="text-slate-700" size={24} />
                    )}
                </button>

                {/* Botón de cerrar sesión */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    type="button"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
