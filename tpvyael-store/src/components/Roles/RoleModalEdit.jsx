import React from 'react';
import { X } from 'lucide-react';

export default function RoleModalEdit({ 
  show, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  error 
}) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
        <div 
          className="sticky top-0 p-6 border-b flex justify-between items-center" 
          style={{ backgroundColor: '#EEEEEE', borderColor: '#B0B0B0' }}
        >
          <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
            Editar Rol
          </h3>
          <button 
            onClick={onClose} 
            style={{ color: '#6C757D' }}
            className="transition-colors hover:opacity-70"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>
              Nombre del Rol *
            </label>
            <input
              type="text"
              value={formData.Nombre}
              onChange={(e) => setFormData({ Nombre: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: '#FDFDFD', 
                color: '#111827',
                border: '2px solid #B0B0B0'
              }}
              placeholder="Ej: Vendedor, Supervisor, Gerente"
            />
            <p className="text-xs mt-1" style={{ color: '#6C757D' }}>
              Actualiza el nombre del rol
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
              <span className="font-bold">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-80"
              style={{ 
                backgroundColor: '#FDFDFD', 
                color: '#6C757D', 
                border: '2px solid #B0B0B0' 
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.Nombre}
              className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
            >
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}