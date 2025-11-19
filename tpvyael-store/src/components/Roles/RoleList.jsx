import React from 'react';
import { Shield, Trash2, RefreshCw, Plus } from 'lucide-react';

export default function RoleList({ 
  roles, 
  loading, 
  onReload, 
  onCreateRole, 
  onEditRole, 
  onDeleteRole 
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold" style={{ color: '#111827' }}>
          Gestión de Roles
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
            onClick={onCreateRole}
            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors hover:opacity-90"
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
          <Shield size={64} className="mx-auto mb-4" style={{ color: '#B0B0B0' }} />
          <p className="text-xl font-semibold" style={{ color: '#111827' }}>No hay roles disponibles</p>
          <p className="mt-2" style={{ color: '#6C757D' }}>Crea tu primer rol haciendo clic en "Nuevo Rol"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div 
              key={role.Id} 
              className="rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105" 
              style={{ backgroundColor: '#EEEEEE' }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: '#6BA54A' }}>
                    <Shield size={32} color="#FDFDFD" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl truncate" style={{ color: '#111827' }}>
                      {role.Nombre}
                    </h3>
                    <p className="text-sm" style={{ color: '#6C757D' }}>
                      ID: {role.Id}
                    </p>
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
                    onClick={() => onEditRole(role)}
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
                    onClick={() => onDeleteRole(role)}
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