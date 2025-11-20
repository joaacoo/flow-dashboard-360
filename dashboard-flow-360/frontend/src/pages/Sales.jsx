import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, FileText, Plus, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Sales = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '',
    productos: [{ nombre: '', cantidad: 1, precio: 0 }],
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Pendiente'
  });
  const [ultimosPedidos, setUltimosPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data } = await api.get('/ventas/pedidos');
        setUltimosPedidos(data);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        // Mantener datos mock si falla
      }
    };
    fetchPedidos();
  }, []);
  // Mock data para el gráfico
  const ventasData = [
    { dia: 'Lun', ventas: 45000 },
    { dia: 'Mar', ventas: 52000 },
    { dia: 'Mié', ventas: 48000 },
    { dia: 'Jue', ventas: 61000 },
    { dia: 'Vie', ventas: 55000 },
    { dia: 'Sáb', ventas: 67000 },
    { dia: 'Dom', ventas: 58000 },
  ];


  const kpis = {
    ventasMes: 386000,
    tendencia: 12.5,
    pedidosActivos: 24,
    ticketPromedio: 16083
  };

  const getEstadoBadge = (estado) => {
    if (estado === 'Completado') {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completado</span>;
    }
    return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pendiente</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Ventas</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Dashboard comercial y gestión de pedidos</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              // Generar CSV con los datos de ventas
              const csvContent = [
                ['ID Pedido', 'Cliente', 'Fecha', 'Monto', 'Estado'].join(','),
                ...ultimosPedidos.map(p => [p.id, p.cliente, p.fecha, p.monto, p.estado].join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <FileText size={20} />
            Exportar Reporte
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Nueva Venta
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ventas del Mes</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">${kpis.ventasMes.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                {kpis.tendencia > 0 ? (
                  <>
                    <TrendingUp className="text-green-500" size={20} />
                    <span className="text-sm font-semibold text-green-500">+{kpis.tendencia}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-red-500" size={20} />
                    <span className="text-sm font-semibold text-red-500">{kpis.tendencia}%</span>
                  </>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400">vs mes anterior</span>
              </div>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <DollarSign className="text-slate-600 dark:text-slate-300" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pedidos Activos</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{kpis.pedidosActivos}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">En proceso</p>
            </div>
            <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <ShoppingBag className="text-orange-600 dark:text-orange-300" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ticket Promedio</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">${kpis.ticketPromedio.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Por pedido</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-300" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Ventas */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Evolución de Ventas (Últimos 7 días)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ventasData}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dia" stroke="#64748b" />
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
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVentas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Últimos Pedidos */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Últimos Pedidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {ultimosPedidos.map(pedido => (
                <tr key={pedido.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{pedido.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{pedido.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{pedido.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">${pedido.monto.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(pedido.estado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Venta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nueva Venta</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Productos
                </label>
                <div className="space-y-3">
                  {formData.productos.map((producto, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={producto.nombre}
                          onChange={(e) => {
                            const nuevosProductos = [...formData.productos];
                            nuevosProductos[index].nombre = e.target.value;
                            setFormData({ ...formData, productos: nuevosProductos });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Nombre del producto"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={producto.cantidad}
                          onChange={(e) => {
                            const nuevosProductos = [...formData.productos];
                            nuevosProductos[index].cantidad = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, productos: nuevosProductos });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Cantidad"
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={producto.precio}
                          onChange={(e) => {
                            const nuevosProductos = [...formData.productos];
                            nuevosProductos[index].precio = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, productos: nuevosProductos });
                          }}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Precio"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        {formData.productos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nuevosProductos = formData.productos.filter((_, i) => i !== index);
                              setFormData({ ...formData, productos: nuevosProductos });
                            }}
                            className="w-full px-2 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, productos: [...formData.productos, { nombre: '', cantidad: 1, precio: 0 }] })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    + Agregar Producto
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-800 dark:text-white">Total:</span>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${formData.productos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
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
                  Crear Venta
                </button>
              </div>
                        </form>
                        {/* Cambiar onSubmit del form */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
