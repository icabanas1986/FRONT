import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RoleModalDelete({ 
  show, 
  onClose, 
  role, 
  onConfirm, 
  loading, 
  error 
}) {
  if (!show || !role) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
        <div className="p-6 border-b" style={{ borderColor: '#B0B0B0' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E05257' }}>
              <AlertTriangle size={24} color="#FDFDFD" />
            </div>
            <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
              Confirmar Eliminación
            </h3>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#FDFDFD' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#6C757D' }}>
              Rol a eliminar:
            </p>
            <p className="text-lg font-bold" style={{ color: '#111827' }}>
              {role.Nombre}
            </p>
            <p className="text-sm mt-2" style={{ color: '#6C757D' }}>
              Usuarios asignados: <span className="font-semibold">{role.Usuarios?.length || 0}</span>
            </p>
          </div>

          <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B' }}>
            <p className="text-sm font-semibold" style={{ color: '#92400E' }}>
              ⚠️ Esta acción no se puede deshacer
            </p>
          </div>

          <p style={{ color: '#6C757D' }}>
            ¿Estás seguro de que deseas eliminar este rol? Los usuarios asignados quedarán sin rol.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
              <span className="font-bold">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4 mt-4">
            <button
              onClick={onClose}
              disabled={loading}
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
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
            >
              {loading ? 'Eliminando...' : 'Eliminar Rol'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}