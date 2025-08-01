import React, { useState } from "react";
import UserRoleForm from "../components/userAssociation/UserRoleForm";
import UserRoleTable from "../components/userAssociation/UserRoleTable";
import UserRoleViewModal from "../components/userAssociation/UserRoleViewModal";

export default function UserRoleAssociation() {
  const [associations, setAssociations] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    role: "",
    editIndex: -1,
  });
  const [showForm, setShowForm] = useState(false);
  const [viewData, setViewData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.editIndex === -1) {
      setAssociations([...associations, formData]);
    } else {
      const updated = [...associations];
      updated[formData.editIndex] = formData;
      setAssociations(updated);
    }
    setFormData({ user: "", role: "", editIndex: -1 });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData({ ...associations[index], editIndex: index });
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this association?")) {
      setAssociations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleView = (index) => {
    setViewData(associations[index]);
  };

  const handleCancel = () => {
    setFormData({ user: "", role: "", editIndex: -1 });
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h3>🔗 User-Role Association</h3>

      {!showForm && (
        <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
          ➕ Add New Association
        </button>
      )}

      {showForm && (
        <UserRoleForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && (
        <UserRoleTable
          associations={associations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {viewData && <UserRoleViewModal data={viewData} onClose={() => setViewData(null)} />}
    </div>
  );
}