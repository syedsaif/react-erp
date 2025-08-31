import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import RoleForm from "../components/role/RoleForm";
import RoleTable from "../components/role/RoleTable";
import { v4 as uuidv4 } from "uuid";
import ConfirmModal from "../../../components/common/ConfirmModal"; // ConfirmModal sahi naam se import karo

export default function Role() {
  // Load roles from localStorage, add ids if missing
  const [roles, setRoles] = useState(() => {
    const stored = localStorage.getItem("roles");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((role) => ({
        id: role.id || uuidv4(),
        ...role,
      }));
    }
    return [];
  });

  const [formData, setFormData] = useState({
    id: null,
    roleName: "",
    isActive: true,
    editIndex: -1,
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const handleSubmit = (payload) => {
    if (!payload.roleName) {
      toast.error("Role Name cannot be empty or spaces only!");
      return;
    }

    if (formData.editIndex === -1) {
      // Add new role
      const newRole = {
        id: uuidv4(),
        roleName: payload.roleName,
        isActive: payload.isActive,
      };
      setRoles((prev) => [...prev, newRole]);
      toast.success("Role added successfully!");
    } else {
      // Update existing role
      setRoles((prev) =>
        prev.map((role) =>
          role.id === payload.id
            ? { ...role, roleName: payload.roleName, isActive: payload.isActive }
            : role
        )
      );
      toast.success("Role updated successfully!");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: null,
      roleName: "",
      isActive: true,
      editIndex: -1,
    });
    setShowForm(false);
  };

  const handleEdit = (role) => {
    setFormData({
      id: role.id,
      roleName: role.roleName,
      isActive: role.isActive,
      editIndex: roles.findIndex((r) => r.id === role.id),
    });
    setShowForm(true);
  };

  // Show modal instead of direct delete
  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
    toast.success("Role deleted successfully!");
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <h3>🛡️ Role Management</h3>

      {!showForm && (
        <button className="btn btn-success mb-3" onClick={handleAddNew}>
          ➕ Add New Role
        </button>
      )}

      {showForm && (
        <RoleForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && (
        <RoleTable
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDeleteClick} // Make sure you pass this new handler here
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete ? roleToDelete.roleName : ""}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}


