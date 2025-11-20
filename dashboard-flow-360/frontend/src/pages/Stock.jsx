import { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, Search, Filter, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../services/api';

const Stock = () => {
    const [activeTab, setActiveTab] = useState('inventario');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        sku: '',
        categoria: '',
        stockInicial: 0,
        puntoPedido: 0,
        precio: 0,
        deposito: 'Central'
    });

    // Mock data
    const kpis = {
        valorTotal: 1250000,
        itemsBajoMinimo: 12,
        itemsSinMovimiento: 8
    };

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const { data } = await api.get('/stock/inventario');
                setProductos(data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                // Mantener datos mock si falla
                setProductos([
        { id: 1, sku: 'PROD-001', nombre: 'Producto A', deposito: 'Central', cantidad: 150, minimo: 50, precio: 2500, categoria: 'Electrónica' },
                ]);
            }
        };
        fetchProductos();
    }, []);

    const filteredProductos = productos.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.categoria === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getStockBadge = (cantidad, minimo) => {
        if (cantidad < minimo) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Bajo</span>;
        } else if (cantidad < minimo * 1.5) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medio</span>;
        }
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Óptimo</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gestión de Stock</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Package className="text-slate-600 dark:text-slate-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Valor Total del Stock</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">${kpis.valorTotal.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                            <AlertTriangle className="text-red-600 dark:text-red-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Items Bajo Mínimo</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{kpis.itemsBajoMinimo}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <TrendingUp className="text-yellow-600 dark:text-yellow-300" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Sin Movimiento</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{kpis.itemsSinMovimiento}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <div className="flex gap-4 px-6">
                        {['inventario', 'movimientos', 'ajustes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === tab
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {tab === 'inventario' && 'Inventario Actual'}
                                {tab === 'movimientos' && 'Movimientos Históricos'}
                                {tab === 'ajustes' && 'Ajustes'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtros */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-slate-400" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todas las categorías</option>
                                <option value="Electrónica">Electrónica</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Oficina">Oficina</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contenido según tab activo */}
                {activeTab === 'inventario' && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Depósito</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cantidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredProductos.map(producto => (
                                <tr key={producto.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{producto.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{producto.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{producto.deposito}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">{producto.cantidad}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStockBadge(producto.cantidad, producto.minimo)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">${producto.precio.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            <button className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}

                {activeTab === 'movimientos' && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Movimientos Históricos</h3>
                        <div className="space-y-3">
                            {[
                                { id: 1, fecha: '19/11/2024 14:30', producto: 'Producto A', tipo: 'Entrada', cantidad: 50, usuario: 'Admin' },
                                { id: 2, fecha: '18/11/2024 10:15', producto: 'Producto B', tipo: 'Salida', cantidad: 25, usuario: 'Admin' },
                                { id: 3, fecha: '17/11/2024 16:45', producto: 'Producto C', tipo: 'Ajuste', cantidad: -10, usuario: 'Admin' },
                                { id: 4, fecha: '16/11/2024 09:20', producto: 'Producto D', tipo: 'Entrada', cantidad: 100, usuario: 'Admin' },
                            ].map(mov => (
                                <div key={mov.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800 dark:text-white">{mov.producto}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{mov.fecha} - {mov.usuario}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            mov.tipo === 'Entrada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            mov.tipo === 'Salida' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {mov.tipo}
                                        </span>
                                        <p className={`text-sm font-semibold mt-1 ${mov.cantidad > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {mov.cantidad > 0 ? '+' : ''}{mov.cantidad}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'ajustes' && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Ajustes de Inventario</h3>
                        <div className="space-y-4">
                            {[
                                { id: 1, fecha: '19/11/2024', producto: 'Producto A', motivo: 'Conteo físico', diferencia: -5, usuario: 'Admin', estado: 'Aprobado' },
                                { id: 2, fecha: '18/11/2024', producto: 'Producto B', motivo: 'Pérdida', diferencia: -2, usuario: 'Admin', estado: 'Pendiente' },
                                { id: 3, fecha: '17/11/2024', producto: 'Producto C', motivo: 'Devolución', diferencia: 10, usuario: 'Admin', estado: 'Aprobado' },
                            ].map(ajuste => (
                                <div key={ajuste.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-white">{ajuste.producto}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{ajuste.fecha} - {ajuste.motivo}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            ajuste.estado === 'Aprobado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {ajuste.estado}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Diferencia:</span>
                                        <span className={`text-sm font-semibold ${ajuste.diferencia > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {ajuste.diferencia > 0 ? '+' : ''}{ajuste.diferencia}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Nuevo Producto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nuevo Producto</h3>
                        <button
                            onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await api.post('/stock/producto', formData);
                                alert('Producto creado exitosamente');
                                setIsModalOpen(false);
                                setFormData({
                                    nombre: '',
                                    sku: '',
                                    categoria: '',
                                    stockInicial: 0,
                                    puntoPedido: 0,
                                    precio: 0,
                                    deposito: 'Central'
                                });
                                // Recargar productos
                                const { data } = await api.get('/stock/inventario');
                                setProductos(data);
                            } catch (error) {
                                alert('Error al crear producto: ' + (error.response?.data?.message || error.message));
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre del Producto
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Nombre del producto"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="SKU-001"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Categoría
                                    </label>
                                    <select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Electrónica">Electrónica</option>
                                        <option value="Hogar">Hogar</option>
                                        <option value="Oficina">Oficina</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Stock Inicial
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stockInicial}
                                        onChange={(e) => setFormData({ ...formData, stockInicial: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Punto de Pedido
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.puntoPedido}
                                        onChange={(e) => setFormData({ ...formData, puntoPedido: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Precio Unitario
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Depósito
                                    </label>
                                    <select
                                        value={formData.deposito}
                                        onChange={(e) => setFormData({ ...formData, deposito: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="Central">Central</option>
                                        <option value="Sucursal 1">Sucursal 1</option>
                                        <option value="Sucursal 2">Sucursal 2</option>
                                    </select>
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
                                    Crear Producto
                        </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stock;
