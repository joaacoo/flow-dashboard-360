import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, DollarSign, Package, Truck, Factory, Users, Settings, Database } from 'lucide-react';


const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    { path: '/cobranzas', icon: DollarSign, label: 'Cobranzas' },
    { path: '/stock', icon: Package, label: 'Stock' },
    { path: '/logistica', icon: Truck, label: 'Logística' },
    { path: '/produccion', icon: Factory, label: 'Producción' },
    { path: '/crm', icon: Users, label: 'CRM' },
    { path: '/reglas', icon: Settings, label: 'Reglas' },
    { path: '/tango', icon: Database, label: 'Tango Gestión' },
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
        className={`h-screen flex flex-col fixed left-0 top-0 transition-transform duration-500 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 bg-slate-900 border-r border-slate-800 text-white`}
        style={{
          boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Logo */}
        <div className="p-6">
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
                ? 'bg-[#3091c6]/10 text-[#3091c6]'
                : 'text-white hover:bg-slate-800 hover:text-white'
                }`}
            >
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3091c6] rounded-r"></div>
              )}
              <item.icon size={20} className="flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>


      </div>
    </>
  );
};

export default Sidebar;
