import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  LogOut, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Menu, 
  X, 
  LayoutDashboard, 
  Box, 
  Store, 
  Shield,
  User,
  BanknoteArrowUp, 
  ListOrdered 
} from 'lucide-react';
import InstallPWA from './components/InstallPWA';
import UsersContainer from './components/Users/UsersContainer';
import RolesContainer from './components/Roles/RolesContainer';

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password
        })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FACC2E' }}>TPV Yael</h1>
          <p className="text-lg" style={{ color: '#6C757D' }}>Panel de Administración</p>
        </div>

        <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: '#EEEEEE' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#111827' }}>Iniciar Sesión</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: '#FDFDFD', 
                  color: '#111827',
                  border: '2px solid #B0B0B0'
                }}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#FDFDFD', 
                    color: '#111827',
                    border: '2px solid #B0B0B0'
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: '#6C757D' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button 
              type="button"
              className="text-sm hover:underline"
              style={{ color: '#6C757D' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Rol', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar roles');
      }
      
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FDFDFD' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ 
          backgroundColor: '#111827',
          width: '280px'
        }}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: '#FACC2E' }}>TPV Yael</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              style={{ color: '#FDFDFD' }}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'overview' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <LayoutDashboard size={20} />
              <span className="font-semibold">Dashboard</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'users' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'users' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <User size={20} />
              <span className="font-semibold">Usuarios</span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'products' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'products' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <Box size={20} />
              <span className="font-semibold">Productos</span>
            </button>

            <button
              onClick={() => { setActiveTab('store'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'store' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'store' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <Store size={20} />
              <span className="font-semibold">Tienda</span>
            </button>

            <button
              onClick={() => { setActiveTab('roles'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'roles' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'roles' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <Shield size={20} />
              <span className="font-semibold">Roles</span>
            </button>

            <button
              onClick={() => { setActiveTab('clientes'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'clientes' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'clientes' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <Users size={20} />
              <span className="font-semibold">Clientes</span>
            </button>

            <button
              onClick={() => { setActiveTab('pagos'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'pagos' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'pagos' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <BanknoteArrowUp size={20} />
              <span className="font-semibold">Pagos</span>
            </button>

            <button
              onClick={() => { setActiveTab('pedidos'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'pedidos' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === 'pedidos' ? '#6BA54A' : 'transparent',
                color: '#FDFDFD' 
              }}
            >
              <ListOrdered size={20} />
              <span className="font-semibold">Pedidos</span>
            </button>
          </nav>

          <div className="p-4 border-t" style={{ borderColor: '#454545' }}>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
            >
              <LogOut size={20} />
              <span className="font-semibold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="shadow-sm sticky top-0 z-30" style={{ backgroundColor: '#EEEEEE' }}>
          <div className="px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg lg:hidden"
              style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
            >
              <Menu size={24} />
            </button>
            
            <h2 className="text-xl font-bold ml-4 lg:ml-0" style={{ color: '#111827' }}>
              {activeTab === 'overview' && 'Panel de Control'}
              {activeTab === 'users' && 'Gestión de Usuarios'}
              {activeTab === 'products' && 'Gestión de Productos'}
              {activeTab === 'store' && 'Tienda'}
              {activeTab === 'roles' && 'Gestión de Roles'}
              {activeTab === 'clientes' && 'Gestión de Clientes'}
              {activeTab === 'pagos' && 'Gestión de Pagos'}
              {activeTab === 'pedidos' && 'Gestión de Pedidos'}
            </h2>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8" style={{ backgroundColor: '#FDFDFD' }}>
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Panel de Control</h2>
              <p style={{ color: '#6C757D' }}>Dashboard en construcción...</p>
            </div>
          )}

          {activeTab === 'users' && (
            <UsersContainer token={token} roles={roles} />
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Gestión de Productos</h2>
              <p style={{ color: '#6C757D' }}>Productos en construcción...</p>
            </div>
          )}

          {activeTab === 'store' && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Tienda</h2>
              <p style={{ color: '#6C757D' }}>Tienda en construcción...</p>
            </div>
          )}

          {activeTab === 'roles' && (
            <RolesContainer token={token} />
          )}

          {activeTab === 'clientes' && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Gestión de Clientes</h2>
              <p style={{ color: '#6C757D' }}>Clientes en construcción...</p>
            </div>
          )}

          {activeTab === 'pagos' && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Gestión de Pagos</h2>
              <p style={{ color: '#6C757D' }}>Pagos en construcción...</p>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Gestión de Pedidos</h2>
              <p style={{ color: '#6C757D' }}>Pedidos en construcción...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const handleLogin = (authToken) => {
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <Dashboard token={token} onLogout={handleLogout} />
      <InstallPWA />
    </>
  );
}