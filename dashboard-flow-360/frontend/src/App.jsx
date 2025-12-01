import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Stock from './pages/Stock';
import CRM from './pages/CRM';
import Logistica from './pages/Logistica';
import Reglas from './pages/Reglas';
import Produccion from './pages/Produccion';
import Cobranzas from './pages/Cobranzas';
import Tango from './pages/Integrations/Tango';
import TestHome from './pages/TestHome';

// Test route placeholder (moved inside Routes)

// Placeholder pages for other modules to avoid errors
const Placeholder = ({ title }) => <div className="text-2xl font-bold text-slate-400">Módulo {title} en construcción</div>;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ventas" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/cobranzas" element={<ProtectedRoute><Cobranzas /></ProtectedRoute>} />
          <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
          <Route path="/logistica" element={<ProtectedRoute><Logistica /></ProtectedRoute>} />
          <Route path="/produccion" element={<ProtectedRoute><Produccion /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
          <Route path="/reglas" element={<ProtectedRoute><Reglas /></ProtectedRoute>} />
          <Route path="/tango" element={<ProtectedRoute><Tango /></ProtectedRoute>} />
          <Route path="/testhome" element={<ProtectedRoute><TestHome /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

