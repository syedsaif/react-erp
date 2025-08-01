import React, { useState } from "react";
import RoleForm from "../components/role/RoleForm";
import RoleTable from "../components/role/RoleTable";
import RoleViewModal from "../components/role/RoleViewModal";
import { toast } from "react-toastify";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    roleName: "",
    isActive: true,
    editIndex: -1,
  });
  const [showForm, setShowForm] = useState(false);
  const [viewRole, setViewRole] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedRoleName = formData.roleName.trim();
    if (!trimmedRoleName) {
      toast.error("Role Name cannot be empty or spaces only!");
      return;
    }

    const newRole = {
      roleName: trimmedRoleName,
      isActive: formData.isActive,
    };

    if (formData.editIndex === -1) {
      setRoles((prev) => [...prev, newRole]);
      toast.success("Role added successfully!");
    } else {
      setRoles((prev) =>
        prev.map((role, idx) =>
          idx === formData.editIndex ? { ...newRole } : role
        )
      );
      toast.success("Role updated successfully!");
    }

    setFormData({
      roleName: "",
      isActive: true,
      editIndex: -1,
    });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    const role = roles[index];
    setFormData({ ...role, editIndex: index });
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRoles((prev) => prev.filter((_, i) => i !== index));
      toast.success("Role deleted successfully!");
    }
  };

  const handleView = (index) => {
    setViewRole(roles[index]);
  };

  const handleCancel = () => {
    setFormData({
      roleName: "",
      isActive: true,
      editIndex: -1,
    });
    setShowForm(false);
  };

  const handleAddNew = () => {
    setFormData({
      roleName: "",
      isActive: true,
      editIndex: -1,
    });
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
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && (
        <RoleTable
          roles={roles}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {viewRole && (
        <RoleViewModal role={viewRole} onClose={() => setViewRole(null)} />
      )}
    </div>
  );
}
