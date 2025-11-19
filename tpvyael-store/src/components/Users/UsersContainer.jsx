import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserModalCreate from './UserModalCreate';
import UserModalEdit from './UserModalEdit';
import UserModalDelete from './UserModalDelete';

export default function UsersContainer({ token, roles }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    Email: '',
    Password: '',
    RolId: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Auth/usuarios', {
        headers: {
          'content-type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Nombre: formData.Nombre,
          Email: formData.Email,
          Password: formData.Password,
          RolId: parseInt(formData.RolId)
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      setShowCreateModal(false);
      setFormData({
        Nombre: '',
        Email: '',
        Password: '',
        RolId: ''
      });
      await loadUsers();
    } catch (error) {
      setFormError(error.message || 'Error al crear el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setFormData({
      Nombre: user.Nombre,
      Email: user.Email,
      Password: '',
      RolId: user.RolId.toString()
    });
    setShowEditModal(true);
  };

  const updateUser = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('https://lish-hwrw.onrender.com/api/Auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Id: selectedUser.Id,
          Nombre: formData.Nombre,
          Email: formData.Email,
          RolId: parseInt(formData.RolId),
          Password: formData.Password || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({
        Nombre: '',
        Email: '',
        Password: '',
        RolId: ''
      });
      await loadUsers();
    } catch (error) {
      setFormError(error.message || 'Error al actualizar el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteUserModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch(`https://lish-hwrw.onrender.com/api/Auth/delete/${selectedUser.Id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      setShowDeleteModal(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      setFormError(error.message || 'Error al eliminar el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormError('');
    setFormData({
      Nombre: '',
      Email: '',
      Password: '',
      RolId: ''
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormError('');
    setSelectedUser(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setFormError('');
    setSelectedUser(null);
  };

  return (
    <>
      <UserList
        users={users}
        roles={roles}
        loading={loading}
        onReload={loadUsers}
        onCreateUser={() => setShowCreateModal(true)}
        onEditUser={openEditUserModal}
        onDeleteUser={openDeleteUserModal}
      />

      <UserModalCreate
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        onSubmit={createUser}
        loading={formLoading}
        error={formError}
      />

      <UserModalEdit
        show={showEditModal}
        onClose={handleCloseEditModal}
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        onSubmit={updateUser}
        loading={formLoading}
        error={formError}
      />

      <UserModalDelete
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        user={selectedUser}
        onConfirm={deleteUser}
        loading={formLoading}
        error={formError}
      />
    </>
  );
}