import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Check, Package, Users, DollarSign, TrendingUp, LogOut, Eye, EyeOff, RefreshCw, Menu, X, LayoutDashboard, Box, Store, Shield } from 'lucide-react';

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
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products');
  const [orderComplete, setOrderComplete] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    Precio: '',
    Stock: '',
    ImagenUrl: '',
    CategoriaId: '',
    Activo: true
  });
  const [roleFormData, setRoleFormData] = useState({
    Nombre: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadRoles();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Producto', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Categorias', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

 const loadRoles = async () => {
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
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.CategoriaId === selectedCategory);

  const createProduct = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Producto/Crear', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          Precio: parseFloat(formData.Precio),
          Stock: parseInt(formData.Stock),
          CategoriaId: parseInt(formData.CategoriaId)
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      setShowCreateModal(false);
      setFormData({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Stock: '',
        ImagenUrl: '',
        CategoriaId: '',
        Activo: true
      });
      
      await loadProducts();
      setActiveTab('products');
    } catch (error) {
      setFormError(error.message || 'Error al crear el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      Nombre: product.Nombre,
      Descripcion: product.Descripcion || '',
      Precio: product.Precio.toString(),
      Stock: product.Stock.toString(),
      ImagenUrl: product.ImagenUrl || '',
      CategoriaId: product.CategoriaId.toString(),
      Activo: product.Activo
    });
    setShowEditModal(true);
  };

  const updateProduct = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch(`https://lish-hwrw.onrender.com/api/Producto/${selectedProduct.Id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Id: selectedProduct.Id,
          Nombre: formData.Nombre,
          Descripcion: formData.Descripcion,
          Precio: parseFloat(formData.Precio),
          Stock: parseInt(formData.Stock),
          Activo: formData.Activo,
          ImagenUrl: formData.ImagenUrl,
          CategoriaId: parseInt(formData.CategoriaId)
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }

      setShowEditModal(false);
      setSelectedProduct(null);
      setFormData({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Stock: '',
        ImagenUrl: '',
        CategoriaId: '',
        Activo: true
      });
      
      await loadProducts();
    } catch (error) {
      setFormError(error.message || 'Error al actualizar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const deleteProduct = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch(`https://lish-hwrw.onrender.com/api/Producto/${selectedProduct.Id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setShowDeleteModal(false);
      setSelectedProduct(null);
      await loadProducts();
    } catch (error) {
      setFormError(error.message || 'Error al eliminar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const createRole = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Rol/crear', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Nombre: roleFormData.Nombre
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el rol');
      }

      setShowCreateRoleModal(false);
      setRoleFormData({ Nombre: '' });
      await loadRoles();
    } catch (error) {
      setFormError(error.message || 'Error al crear el rol');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditRoleModal = (role) => {
    setSelectedRole(role);
    setRoleFormData({ Nombre: role.Nombre });
    setShowEditRoleModal(true);
  };

  const updateRole = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch(`https://lish-hwrw.onrender.com/api/Rol/${selectedRole.Id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          IdRol: selectedRole.Id,
          Nombre: roleFormData.Nombre
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el rol');
      }

      setShowEditRoleModal(false);
      setSelectedRole(null);
      setRoleFormData({ Nombre: '' });
      await loadRoles();
    } catch (error) {
      setFormError(error.message || 'Error al actualizar el rol');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteRoleModal = (role) => {
    setSelectedRole(role);
    setShowDeleteRoleModal(true);
  };

  const deleteRole = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch(`https://lish-hwrw.onrender.com/api/Rol/${selectedRole.Id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      setShowDeleteRoleModal(false);
      setSelectedRole(null);
      await loadRoles();
    } catch (error) {
      setFormError(error.message || 'Error al eliminar el rol');
    } finally {
      setFormLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.Id === product.Id);
    if (existing) {
      setCart(cart.map(item =>
        item.Id === product.Id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item.Id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.Id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.Precio * item.quantity), 0);
  };

  const completeOrder = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setCart([]);
      setOrderComplete(false);
      setView('products');
    }, 3000);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDFDFD' }}>
        <div className="text-center p-8 rounded-lg" style={{ backgroundColor: '#EEEEEE' }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#6BA54A' }}>
            <Check size={48} color="#FDFDFD" />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>¡Compra Exitosa!</h2>
          <p style={{ color: '#6C757D' }}>Tu pedido ha sido procesado correctamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FDFDFD' }}>
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
              {activeTab === 'products' && 'Gestión de Productos'}
              {activeTab === 'store' && 'Tienda'}
              {activeTab === 'roles' && 'Gestión de Roles'}
            </h2>

            {activeTab === 'store' && (
              <button
                onClick={() => setView(view === 'products' ? 'cart' : 'products')}
                className="relative p-2 rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: '#6BA54A' }}
              >
                <ShoppingCart color="#FDFDFD" size={24} />
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
                  >
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#EEEEEE' }}>
              <div className="sticky top-0 p-6 border-b flex justify-between items-center" style={{ backgroundColor: '#EEEEEE', borderColor: '#B0B0B0' }}>
                <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Crear Nuevo Producto</h3>
                <button onClick={() => setShowCreateModal(false)} style={{ color: '#6C757D' }}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                    placeholder="Ej: Impresora Térmica QL-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    Descripción
                  </label>
                  <textarea
                    name="Descripcion"
                    value={formData.Descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                    placeholder="Describe las características del producto..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Precio *
                    </label>
                    <input
                      type="number"
                      name="Precio"
                      value={formData.Precio}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: '#FDFDFD', 
                        color: '#111827',
                        border: '2px solid #B0B0B0'
                      }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="Stock"
                      value={formData.Stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: '#FDFDFD', 
                        color: '#111827',
                        border: '2px solid #B0B0B0'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    Categoría *
                  </label>
                  <select
                    name="CategoriaId"
                    value={formData.CategoriaId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat.Id} value={cat.Id}>{cat.Nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    URL de la Imagen
                  </label>
                  <input
                    type="text"
                    name="ImagenUrl"
                    value={formData.ImagenUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.ImagenUrl && (
                    <img 
                      src={formData.ImagenUrl}
                      alt="Preview" 
                      className="mt-2 w-32 h-32 object-cover rounded"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="Activo"
                    checked={formData.Activo}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                    style={{ accentColor: '#6BA54A' }}
                  />
                  <label className="text-sm font-semibold" style={{ color: '#111827' }}>
                    Producto Activo
                  </label>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 rounded-lg font-semibold"
                    style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createProduct}
                    disabled={formLoading || !formData.Nombre || !formData.Precio || !formData.Stock || !formData.CategoriaId}
                    className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
                  >
                    {formLoading ? 'Creando...' : 'Crear Producto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCreateRoleModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
      <div className="sticky top-0 p-6 border-b flex justify-between items-center" style={{ backgroundColor: '#EEEEEE', borderColor: '#B0B0B0' }}>
        <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Crear Nuevo Rol</h3>
        <button onClick={() => { setShowCreateRoleModal(false); setFormError(''); }} style={{ color: '#6C757D' }}>
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
            Nombre del Rol *
          </label>
          <input
            type="text"
            value={roleFormData.Nombre}
            onChange={(e) => setRoleFormData({ Nombre: e.target.value })}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: '#FDFDFD', 
              color: '#111827',
              border: '2px solid #B0B0B0'
            }}
            placeholder="Ej: Vendedor, Supervisor, Gerente"
          />
        </div>

        {formError && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
            {formError}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => { setShowCreateRoleModal(false); setFormError(''); }}
            className="flex-1 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
          >
            Cancelar
          </button>
          <button
            onClick={createRole}
            disabled={formLoading || !roleFormData.Nombre}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
          >
            {formLoading ? 'Creando...' : 'Crear Rol'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}



        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#EEEEEE' }}>
              <div className="sticky top-0 p-6 border-b flex justify-between items-center" style={{ backgroundColor: '#EEEEEE', borderColor: '#B0B0B0' }}>
                <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Editar Producto</h3>
                <button onClick={() => { setShowEditModal(false); setFormError(''); }} style={{ color: '#6C757D' }}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                    placeholder="Ej: Impresora Térmica QL-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    Descripción
                  </label>
                  <textarea
                    name="Descripcion"
                    value={formData.Descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                    placeholder="Describe las características del producto..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Precio *
                    </label>
                    <input
                      type="number"
                      name="Precio"
                      value={formData.Precio}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: '#FDFDFD', 
                        color: '#111827',
                        border: '2px solid #B0B0B0'
                      }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="Stock"
                      value={formData.Stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: '#FDFDFD', 
                        color: '#111827',
                        border: '2px solid #B0B0B0'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    Categoría *
                  </label>
                  <select
                    name="CategoriaId"
                    value={formData.CategoriaId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat.Id} value={cat.Id}>{cat.Nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
                    URL de la Imagen
                  </label>
                  <input
                    type="text"
                    name="ImagenUrl"
                    value={formData.ImagenUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#111827',
                      border: '2px solid #B0B0B0'
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.ImagenUrl && (
                    <img 
                      src={formData.ImagenUrl} 
                      alt="Preview" 
                      className="mt-2 w-32 h-32 object-cover rounded"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="Activo"
                    checked={formData.Activo}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                    style={{ accentColor: '#6BA54A' }}
                  />
                  <label className="text-sm font-semibold" style={{ color: '#111827' }}>
                    Producto Activo
                  </label>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowEditModal(false); setFormError(''); }}
                    className="flex-1 py-3 rounded-lg font-semibold"
                    style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={updateProduct}
                    disabled={formLoading || !formData.Nombre || !formData.Precio || !formData.Stock || !formData.CategoriaId}
                    className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
                  >
                    {formLoading ? 'Actualizando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
              <div className="p-6 border-b" style={{ borderColor: '#B0B0B0' }}>
                <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Confirmar Eliminación</h3>
              </div>

              <div className="p-6">
                <p style={{ color: '#6C757D' }}>
                  ¿Estás seguro de que deseas eliminar el producto "{selectedProduct.Nombre}"? Esta acción no se puede deshacer.
                </p>

                {formError && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4 mt-4">
                  <button
                    onClick={() => { setShowDeleteModal(false); setSelectedProduct(null); setFormError(''); }}
                    className="flex-1 py-3 rounded-lg font-semibold"
                    style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteProduct}
                    disabled={formLoading}
                    className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
                  >
                    {formLoading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteRoleModal && selectedRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
              <div className="p-6 border-b" style={{ borderColor: '#B0B0B0' }}>
                <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Confirmar Eliminación</h3>
              </div>

              <div className="p-6">
                <p style={{ color: '#6C757D' }}>
                  ¿Estás seguro de que deseas eliminar el rol "{selectedRole.Nombre}"? Esta acción no se puede deshacer.
                </p>

                {formError && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-4 mt-4">
                  <button
                    onClick={() => { setShowDeleteRoleModal(false); setSelectedRole(null); setFormError(''); }}
                    className="flex-1 py-3 rounded-lg font-semibold"
                    style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteRole}
                    disabled={formLoading}
                    className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
                  >
                    {formLoading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
      <div className="sticky top-0 p-6 border-b flex justify-between items-center" style={{ backgroundColor: '#EEEEEE', borderColor: '#B0B0B0' }}>
        <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Editar Rol</h3>
        <button onClick={() => { setShowEditRoleModal(false); setFormError(''); }} style={{ color: '#6C757D' }}>
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
            Nombre del Rol *
          </label>
          <input
            type="text"
            value={roleFormData.Nombre}
            onChange={(e) => setRoleFormData({ Nombre: e.target.value })}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: '#FDFDFD', 
              color: '#111827',
              border: '2px solid #B0B0B0'
            }}
            placeholder="Ej: Vendedor, Supervisor, Gerente"
          />
        </div>

        {formError && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
            {formError}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => { setShowEditRoleModal(false); setFormError(''); }}
            className="flex-1 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
          >
            Cancelar
          </button>
          <button
            onClick={updateRole}
            disabled={formLoading || !roleFormData.Nombre}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
          >
            {formLoading ? 'Editando...' : 'Editar Rol'}
          </button>
        </div>
      </div>
    </div>
  </div>
        )}

        <div className="flex-1 p-4 lg:p-8">
          {activeTab === 'overview' && (
            <>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Panel de Control</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor: '#EEEEEE' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#6C757D' }}>Ventas Totales</h3>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#6BA54A' }}>
                      <DollarSign size={24} color="#FDFDFD" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#111827' }}>$24,580</p>
                  <p className="text-sm mt-2" style={{ color: '#6BA54A' }}>+12.5% vs mes anterior</p>
                </div>

                <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor: '#EEEEEE' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#6C757D' }}>Pedidos</h3>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#FACC2E' }}>
                      <Package size={24} color="#111827" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#111827' }}>142</p>
                  <p className="text-sm mt-2" style={{ color: '#6BA54A' }}>+8.2% vs mes anterior</p>
                </div>

                <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor: '#EEEEEE' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#6C757D' }}>Clientes</h3>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#E05257' }}>
                      <Users size={24} color="#FDFDFD" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#111827' }}>1,248</p>
                  <p className="text-sm mt-2" style={{ color: '#6BA54A' }}>+23.1% vs mes anterior</p>
                </div>

                <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor: '#EEEEEE' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#6C757D' }}>Ticket Promedio</h3>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#111827' }}>
                      <TrendingUp size={24} color="#FACC2E" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#111827' }}>$173</p>
                  <p className="text-sm mt-2" style={{ color: '#6BA54A' }}>+5.4% vs mes anterior</p>
                </div>
              </div>

              <div className="rounded-lg p-6 shadow-lg" style={{ backgroundColor: '#EEEEEE' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#111827' }}>Pedidos Recientes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                        <th className="text-left py-3 px-2" style={{ color: '#6C757D' }}>ID</th>
                        <th className="text-left py-3 px-2" style={{ color: '#6C757D' }}>Cliente</th>
                        <th className="text-left py-3 px-2" style={{ color: '#6C757D' }}>Producto</th>
                        <th className="text-left py-3 px-2" style={{ color: '#6C757D' }}>Total</th>
                        <th className="text-left py-3 px-2" style={{ color: '#6C757D' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                        <td className="py-3 px-2" style={{ color: '#111827' }}>#1024</td>
                        <td className="py-3 px-2" style={{ color: '#111827' }}>Ana García</td>
                        <td className="py-3 px-2" style={{ color: '#111827' }}>Producto Premium</td>
                        <td className="py-3 px-2 font-semibold" style={{ color: '#6BA54A' }}>$1,299</td>
                        <td className="py-3 px-2">
                          <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}>
                            Completado
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b" style={{ borderColor: '#B0B0B0' }}>
                        <td className="py-3 px-2" style={{ color: '#111827' }}>#1023</td>
                        <td className="py-3 px-2" style={{ color: '#111827' }}>Carlos López</td>
                        <td className="py-3 px-2" style={{ color: '#111827' }}>Producto Elite</td>
                        <td className="py-3 px-2 font-semibold" style={{ color: '#6BA54A' }}>$1,599</td>
                        <td className="py-3 px-2">
                          <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#FACC2E', color: '#111827' }}>
                            En Proceso
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold" style={{ color: '#111827' }}>Gestión de Productos</h2>
                <div className="flex gap-3">
                  <button
                    onClick={loadProducts}
                    disabled={loading}
                    className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2"
                    style={{ backgroundColor: '#FACC2E', color: '#111827' }}
                  >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    Recargar
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                    style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
                  >
                    <Plus size={20} />
                    Nuevo Producto
                  </button>
                </div>
              </div>

              <div className="mb-6 flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedCategory === 'all' ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{ backgroundColor: selectedCategory === 'all' ? '#6BA54A' : '#B0B0B0', color: '#FDFDFD' }}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.Id}
                    onClick={() => setSelectedCategory(cat.Id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === cat.Id ? 'opacity-100' : 'opacity-60'
                    }`}
                    style={{ backgroundColor: selectedCategory === cat.Id ? '#6BA54A' : '#B0B0B0', color: '#FDFDFD' }}
                  >
                    {cat.Nombre}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw size={48} className="animate-spin mx-auto" style={{ color: '#6BA54A' }} />
                  <p className="mt-4" style={{ color: '#6C757D' }}>Cargando productos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl" style={{ color: '#6C757D' }}>No hay productos disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.Id} className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#EEEEEE' }}>
                      <img 
                        src={product.ImagenUrl || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
                        alt={product.Nombre} 
                        className="w-full h-48 object-cover" 
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg" style={{ color: '#111827' }}>{product.Nombre}</h3>
                          {product.Activo ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}>
                              Activo
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
                              Inactivo
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-3 line-clamp-2" style={{ color: '#6C757D' }}>{product.Descripcion || 'Sin descripción'}</p>
                        <div className="mb-2">
                          <span className="text-xs font-semibold" style={{ color: '#6C757D' }}>
                            Categoría: <span style={{ color: '#111827' }}>{product.Categoria?.Nombre || 'Sin categoría'}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-2xl font-bold" style={{ color: '#6BA54A' }}>
                            ${product.Precio.toFixed(2)}
                          </span>
                          <span className="text-sm" style={{ color: product.Stock > 10 ? '#6BA54A' : '#E05257' }}>
                            Stock: <span className="font-semibold">{product.Stock}</span>
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex-1 py-2 rounded-lg font-semibold"
                            style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="px-4 py-2 rounded-lg"
                            style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'roles' && (
  <>
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold" style={{ color: '#111827' }}>Gestión de Roles</h2>
      <div className="flex gap-3">
        <button
          onClick={loadRoles}
          disabled={loading}
          className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2"
          style={{ backgroundColor: '#FACC2E', color: '#111827' }}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          Recargar
        </button>
        <button
          onClick={() => setShowCreateRoleModal(true)}
          className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
        >
          <Plus size={20} />
          Nuevo Rol
        </button>
      </div>
    </div>

    {loading ? (
      <div className="text-center py-12">
        <RefreshCw size={48} className="animate-spin mx-auto" style={{ color: '#6BA54A' }} />
        <p className="mt-4" style={{ color: '#6C757D' }}>Cargando roles...</p>
      </div>
    ) : roles.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-xl" style={{ color: '#6C757D' }}>No hay roles disponibles</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.Id} className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#EEEEEE' }}>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#6BA54A' }}>
                  <Shield size={32} color="#FDFDFD" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl" style={{ color: '#111827' }}>{role.Nombre}</h3>
                  <span className="text-sm" style={{ color: '#6C757D' }}>ID: {role.Id}</span>
                </div>
              </div>
              
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FDFDFD' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#6C757D' }}>
                  Usuarios asignados:
                </p>
                <p className="text-2xl font-bold" style={{ color: '#111827' }}>
                  {role.Usuarios?.length || 0}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditRoleModal(role)}
                  className="flex-1 py-2 rounded-lg font-semibold hover:opacity-80"
                  style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => openDeleteRoleModal(role)}
                  className="px-4 py-2 rounded-lg hover:opacity-80"
                  style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}
          {activeTab === 'store' && (
            <>
              {view === 'products' ? (
                <>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: '#111827' }}>Productos Destacados</h2>
                  
                  <div className="mb-6 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedCategory === 'all' ? 'opacity-100' : 'opacity-60'
                      }`}
                      style={{ backgroundColor: selectedCategory === 'all' ? '#6BA54A' : '#B0B0B0', color: '#FDFDFD' }}
                    >
                      Todos
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.Id}
                        onClick={() => setSelectedCategory(cat.Id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          selectedCategory === cat.Id ? 'opacity-100' : 'opacity-60'
                        }`}
                        style={{ backgroundColor: selectedCategory === cat.Id ? '#6BA54A' : '#B0B0B0', color: '#FDFDFD' }}
                      >
                        {cat.Nombre}
                      </button>
                    ))}
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <RefreshCw size={48} className="animate-spin mx-auto" style={{ color: '#6BA54A' }} />
                      <p className="mt-4" style={{ color: '#6C757D' }}>Cargando productos...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-xl" style={{ color: '#6C757D' }}>No hay productos disponibles</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProducts.filter(p => p.Activo && p.Stock > 0).map(product => (
                        <div
                          key={product.Id}
                          className="rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                          style={{ backgroundColor: '#EEEEEE' }}
                        >
                          <img 
                            src={product.ImagenUrl || 'https://via.placeholder.com/400x400?text=Sin+Imagen'} 
                            alt={product.Nombre} 
                            className="w-full h-48 object-cover" 
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2" style={{ color: '#111827' }}>{product.Nombre}</h3>
                            <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6C757D' }}>{product.Descripcion || 'Sin descripción'}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold" style={{ color: '#6BA54A' }}>
                                ${product.Precio.toFixed(2)}
                              </span>
                              <button
                                onClick={() => addToCart(product)}
                                className="px-4 py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
                                style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-8" style={{ color: '#111827' }}>Carrito de Compras</h2>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-xl" style={{ color: '#6C757D' }}>Tu carrito está vacío</p>
                      <button
                        onClick={() => setView('products')}
                        className="mt-4 px-6 py-3 rounded-lg font-semibold"
                        style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
                      >
                        Ver Productos
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                          <div
                            key={item.Id}
                            className="flex gap-4 p-4 rounded-lg"
                            style={{ backgroundColor: '#EEEEEE' }}
                          >
                            <img 
                              src={item.ImagenUrl || 'https://via.placeholder.com/100x100?text=Sin+Imagen'} 
                              alt={item.Nombre} 
                              className="w-24 h-24 object-cover rounded" 
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg" style={{ color: '#111827' }}>{item.Nombre}</h3>
                              <p className="font-semibold" style={{ color: '#6BA54A' }}>
                                ${item.Precio.toFixed(2)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.Id, -1)}
                                  className="p-1 rounded"
                                  style={{ backgroundColor: '#B0B0B0' }}
                                >
                                  <Minus size={16} color="#111827" />
                                </button>
                                <span className="px-4 py-1 rounded font-semibold" style={{ backgroundColor: '#FDFDFD', color: '#111827' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.Id, 1)}
                                  className="p-1 rounded"
                                  style={{ backgroundColor: '#6BA54A' }}
                                >
                                  <Plus size={16} color="#FDFDFD" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.Id)}
                                  className="ml-auto p-2 rounded hover:opacity-80"
                                  style={{ backgroundColor: '#E05257' }}
                                >
                                  <Trash2 size={16} color="#FDFDFD" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg" style={{ color: '#111827' }}>
                                ${(item.Precio * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="rounded-lg p-6 sticky top-4" style={{ backgroundColor: '#EEEEEE' }}>
                          <h3 className="text-xl font-bold mb-4" style={{ color: '#111827' }}>Resumen del Pedido</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span style={{ color: '#6C757D' }}>Subtotal:</span>
                              <span style={{ color: '#111827' }}>${getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{ color: '#6C757D' }}>Envío:</span>
                              <span style={{ color: '#6BA54A' }}>Gratis</span>
                            </div>
                            <div className="border-t pt-2 mt-2" style={{ borderColor: '#B0B0B0' }}>
                              <div className="flex justify-between text-xl font-bold">
                                <span style={{ color: '#111827' }}>Total:</span>
                                <span style={{ color: '#6BA54A' }}>${getTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={completeOrder}
                            className="w-full py-3 rounded-lg font-bold text-lg transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
                          >
                            Finalizar Compra
                          </button>
                          <button
                            onClick={() => setView('products')}
                            className="w-full mt-2 py-2 rounded-lg font-semibold"
                            style={{ backgroundColor: '#FDFDFD', color: '#6C757D', border: '2px solid #B0B0B0' }}
                          >
                            Continuar Comprando
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
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

  return <Dashboard token={token} onLogout={handleLogout} />;
}