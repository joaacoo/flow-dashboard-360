import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await api.get('/ventas/resumen');
        setSalesData(salesRes.data);
        // Mock stock data for chart
        setStockData({
          labels: ['Disponible', 'Reservado', 'En Tránsito'],
          datasets: [{
            data: [300, 50, 100],
            backgroundColor: ['#3B82F6', '#F59E0B', '#10B981']
          }]
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Dashboard General</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ventas del Día</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">${salesData?.dia?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ventas del Mes</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">${salesData?.mes?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Alertas Activas</h3>
          <p className="text-3xl font-bold text-red-500 dark:text-red-400 mt-2">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Resumen de Stock</h3>
          <div className="h-64 flex justify-center">
            {stockData && <Doughnut data={stockData} options={{ maintainAspectRatio: false }} />}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-300">Nuevo pedido ingresado</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Hace {i * 5} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
