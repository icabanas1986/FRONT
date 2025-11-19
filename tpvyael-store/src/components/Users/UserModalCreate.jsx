import React from 'react';
import { X } from 'lucide-react';

export default function UserModalCreate({ 
  show, 
  onClose, 
  formData, 
  setFormData, 
  roles, 
  onSubmit, 
  loading, 
  error 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
        <div 
          className="sticky top-0 p-6 border-b flex justify-between items-center" 
          style={{ backgroundColor: '#EEEEEE', borderColor: '#B0B0B0' }}
        >
          <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
            Crear Nuevo Usuario
          </h3>
          <button onClick={onClose} style={{ color: '#6C757D' }}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.Nombre}
              onChange={(e) => setFormData({...formData, Nombre: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: '#FDFDFD', 
                color: '#111827',
                border: '2px solid #B0B0B0'
              }}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.Email}
              onChange={(e) => setFormData({...formData, Email: e.target.value})}
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
              Contraseña *
            </label>
            <input
              type="password"
              value={formData.Password}
              onChange={(e) => setFormData({...formData, Password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: '#FDFDFD', 
                color: '#111827',
                border: '2px solid #B0B0B0'
              }}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
              Rol *
            </label>
            <select
              value={formData.RolId}
              onChange={(e) => setFormData({...formData, RolId: e.target.value})}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: '#FDFDFD', 
                color: '#111827',
                border: '2px solid #B0B0B0'
              }}
            >
              <option value="">Selecciona un rol</option>
              {roles.map(rol => (
                <option key={rol.Id} value={rol.Id}>{rol.Nombre}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold"
              style={{ 
                backgroundColor: '#FDFDFD', 
                color: '#6C757D', 
                border: '2px solid #B0B0B0' 
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !formData.Nombre || !formData.Email || !formData.Password || !formData.RolId}
              className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}