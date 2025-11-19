import React from 'react';
import { User, Trash2, RefreshCw, Plus } from 'lucide-react';

export default function UserList({ 
  users, 
  roles, 
  loading, 
  onReload, 
  onCreateUser, 
  onEditUser, 
  onDeleteUser 
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold" style={{ color: '#111827' }}>
          Gestión de Usuarios
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onReload}
            disabled={loading}
            className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors hover:opacity-80"
            style={{ backgroundColor: '#FACC2E', color: '#111827' }}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Recargar
          </button>
          <button
            onClick={onCreateUser}
            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors hover:opacity-90"
            style={{ backgroundColor: '#6BA54A', color: '#FDFDFD' }}
          >
            <Plus size={20} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={48} className="animate-spin mx-auto" style={{ color: '#6BA54A' }} />
          <p className="mt-4" style={{ color: '#6C757D' }}>Cargando usuarios...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <User size={64} className="mx-auto mb-4" style={{ color: '#B0B0B0' }} />
          <p className="text-xl font-semibold" style={{ color: '#111827' }}>No hay usuarios disponibles</p>
          <p className="mt-2" style={{ color: '#6C757D' }}>Crea tu primer usuario haciendo clic en "Nuevo Usuario"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div 
              key={user.Id} 
              className="rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105" 
              style={{ backgroundColor: '#EEEEEE' }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: '#FACC2E' }}>
                    <User size={32} color="#111827" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl truncate" style={{ color: '#111827' }}>
                      {user.Nombre}
                    </h3>
                    <p className="text-sm truncate" style={{ color: '#6C757D' }}>
                      {user.Email}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FDFDFD' }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#6C757D' }}>
                    Rol asignado:
                  </p>
                  <p className="text-lg font-bold" style={{ color: '#111827' }}>
                    {roles.find(r => r.Id === user.RolId)?.Nombre || 'Sin rol'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEditUser(user)}
                    className="flex-1 py-2 rounded-lg font-semibold transition-colors hover:opacity-80"
                    style={{ 
                      backgroundColor: '#FDFDFD', 
                      color: '#6C757D', 
                      border: '2px solid #B0B0B0' 
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="px-4 py-2 rounded-lg transition-colors hover:opacity-80"
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
  );
}