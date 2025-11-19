import React, { useState, useEffect } from 'react';
import RoleList from './RoleList';
import RoleModalCreate from './RoleModalCreate';
import RoleModalEdit from './RoleModalEdit';
import RoleModalDelete from './RoleModalDelete';

export default function RolesContainer({ token }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

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
          Nombre: formData.Nombre
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el rol');
      }

      setShowCreateModal(false);
      setFormData({ Nombre: '' });
      await loadRoles();
    } catch (error) {
      setFormError(error.message || 'Error al crear el rol');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditRoleModal = (role) => {
    setSelectedRole(role);
    setFormData({ Nombre: role.Nombre });
    setShowEditModal(true);
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
          Nombre: formData.Nombre
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el rol');
      }

      setShowEditModal(false);
      setSelectedRole(null);
      setFormData({ Nombre: '' });
      await loadRoles();
    } catch (error) {
      setFormError(error.message || 'Error al actualizar el rol');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteRoleModal = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
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

      setShowDeleteModal(false);
      setSelectedRole(null);
      await loadRoles();
    } catch (error) {
      setFormError(error.message || 'Error al eliminar el rol');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormError('');
    setFormData({ Nombre: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormError('');
    setSelectedRole(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setFormError('');
    setSelectedRole(null);
  };

  return (
    <>
      <RoleList
        roles={roles}
        loading={loading}
        onReload={loadRoles}
        onCreateRole={() => setShowCreateModal(true)}
        onEditRole={openEditRoleModal}
        onDeleteRole={openDeleteRoleModal}
      />

      <RoleModalCreate
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={createRole}
        loading={formLoading}
        error={formError}
      />

      <RoleModalEdit
        show={showEditModal}
        onClose={handleCloseEditModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={updateRole}
        loading={formLoading}
        error={formError}
      />

      <RoleModalDelete
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        role={selectedRole}
        onConfirm={deleteRole}
        loading={formLoading}
        error={formError}
      />
    </>
  );
}