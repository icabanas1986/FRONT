import React from 'react';

export default function UserModalDelete({ 
  show, 
  onClose, 
  user, 
  onConfirm, 
  loading, 
  error 
}) {
  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="rounded-lg shadow-xl max-w-md w-full" style={{ backgroundColor: '#EEEEEE' }}>
        <div className="p-6 border-b" style={{ borderColor: '#B0B0B0' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
            Confirmar Eliminación
          </h3>
        </div>

        <div className="p-6">
          <p style={{ color: '#6C757D' }}>
            ¿Estás seguro de que deseas eliminar al usuario "{user.Nombre}"? Esta acción no se puede deshacer.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 mt-4">
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
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#E05257', color: '#FDFDFD' }}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}