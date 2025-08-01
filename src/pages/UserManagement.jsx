import React, { useState } from "react";
import UserForm from "../components/user/UserForm";
import UserTable from "../components/user/UserTable";
import UserViewModal from "../components/user/UserViewModal";

import { Container, Button } from "react-bootstrap";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellNo: "",
    gender: "",
    department: "IT",
    designation: "Manager",
    role: "Admin",
    editIndex: -1,
  });

  const [showForm, setShowForm] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.editIndex === -1) {
      setUsers((prev) => [...prev, { ...formData }]);
    } else {
      setUsers((prev) =>
        prev.map((user, idx) => (idx === formData.editIndex ? { ...formData } : user))
      );
    }
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (index) => {
    const user = users[index];
    setFormData({ ...user, editIndex: index });
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleView = (index) => {
    setViewUser(users[index]);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleAddNew = () => {
    setShowForm(true);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      cellNo: "",
      gender: "",
      department: "IT",
      designation: "Manager",
      role: "Admin",
      editIndex: -1,
    });
  };

  return (
    <Container className="mt-4">
      <h3>👤 User Management</h3>

      {!showForm && (
        <Button variant="success" className="mb-3" onClick={handleAddNew}>
          ➕ Add New User
        </Button>
      )}

      {showForm && (
        <UserForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && (
        <UserTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* React Bootstrap modal to view user */}
      {viewUser && (
        <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />
      )}
    </Container>
  );
}
