import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, DollarSign, Package, Truck, Factory, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    { path: '/cobranzas', icon: DollarSign, label: 'Cobranzas' },
    { path: '/stock', icon: Package, label: 'Stock' },
    { path: '/logistica', icon: Truck, label: 'Logística' },
    { path: '/produccion', icon: Factory, label: 'Producción' },
    { path: '/crm', icon: Users, label: 'CRM' },
    { path: '/reglas', icon: Settings, label: 'Reglas' },
  ];

  return (
    <>
      {/* Overlay para cerrar el sidebar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar estilo sobrio */}
      <div
        className={`h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 transition-transform duration-500 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64`}
        style={{
          boxShadow: '2px 0 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex flex-col">
            <div className="text-3xl font-bold">
              <span className="text-blue-400">FLOW </span>
              <span className="text-slate-300">360°</span>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
            >
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-r"></div>
              )}
              <item.icon size={20} className="flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-900/10"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
