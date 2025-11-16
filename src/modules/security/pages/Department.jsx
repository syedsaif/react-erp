import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import DepartmentForm from "../components/Department/DepartmentForm";
import DepartmentTable from "../components/Department/DepartmentTable";
import DepartmentView from "../components/Department/DepartmentView";

import api from "../../../services/apiInterceptor";
import Modal from "../../../components/common/Modal";

export default function Department() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  // 📌 Unified modal state (same style as Document page)
  const [modalState, setModalState] = useState({
    show: false,
    type: "",
    data: {},
  });

  const reloadTable = () => setRefreshFlag((prev) => !prev);

  const handleAddNew = () => {
    setSelectedDept(null);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setShowView(false);
    setShowForm(true);
  };

  const handleView = (dept) => {
    setSelectedDept(dept);
    setShowForm(false);
    setShowView(true);
  };

  // 🗑 Step-1 — Open Delete Confirmation Modal
  const handleDeleteRequest = (dept) => {
    setModalState({
      show: true,
      type: "confirm",
      data: {
        title: "Confirm Deletion",
        message: `Are you sure you want to delete department "${dept.name}"?`,
        department: dept,
      },
    });
  };

  // 🗑 Step-2 — Actual DELETE CALL
  const deleteDepartment = async (dept) => {
    try {
      const response = await api.delete(`department/Delete/${dept.id}`);

      if (response.status === 200) {
        toast.success("🗑️ Department deleted successfully!");
        reloadTable();

        if (selectedDept?.id === dept.id) {
          handleCancel();
        }
      } else {
        toast.error("❌ Failed to delete department!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        "❌ " +
          (error.response?.data?.message || "Failed to delete department.")
      );
    }
  };

  // 🔥 Step-3 — Handle Modal Confirm
  const handleModalConfirm = async () => {
    const { type, data } = modalState;

    if (type === "confirm") {
      await deleteDepartment(data.department);
    }

    closeModal();
  };

  // Close modal
  const closeModal = () =>
    setModalState({
      show: false,
      type: "",
      data: {},
    });

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedDept(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedDept(null);
    reloadTable();
  };

  return (
    <div className="container mt-4">
      <Card title="🏢 Department Management" className="shadow-sm">
        
        {/* Header buttons */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {!showForm && !showView ? (
            <Button
              label="Add New"
              icon="pi pi-plus"
              className="p-button-success"
              onClick={handleAddNew}
            />
          ) : (
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              className="p-button-secondary"
              onClick={handleCancel}
            />
          )}
        </div>

        {/* Screens */}
        {showForm ? (
          <DepartmentForm
            key={selectedDept?.id || "new"}
            initialData={selectedDept}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <DepartmentView department={selectedDept} onBack={handleCancel} />
        ) : (
          <DepartmentTable
            key={refreshFlag}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteRequest}
          />
        )}

        {/* Unified Modal */}
        <Modal
          show={modalState.show}
          type={modalState.type}
          onCancel={closeModal}
          onConfirm={handleModalConfirm}
          {...modalState.data}
        />
      </Card>
    </div>
  );
}
