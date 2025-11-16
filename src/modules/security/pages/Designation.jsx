import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import DesignationForm from "../components/Designation/DesignationForm";
import DesignationTable from "../components/Designation/DesignationTable";
import DesignationView from "../components/Designation/DesignationView";

import api from "../../../services/apiInterceptor";
import Modal from "../../../components/common/Modal";

export default function Designation() {
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  // 📌 Unified Modal Format (same as Department)
  const [modalState, setModalState] = useState({
    show: false,
    type: "",
    data: {},
  });

  const reloadTable = () => setRefreshFlag((prev) => !prev);

  const handleAddNew = () => {
    setSelectedDesignation(null);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (designation) => {
    setSelectedDesignation(designation);
    setShowView(false);
    setShowForm(true);
  };

  const handleView = (designation) => {
    setSelectedDesignation(designation);
    setShowForm(false);
    setShowView(true);
  };

  // 🗑 Step-1 — Open Delete Confirmation Modal
  const handleDeleteRequest = (designation) => {
    setModalState({
      show: true,
      type: "confirm",
      data: {
        title: "Confirm Deletion",
        message: `Are you sure you want to delete designation "${designation.name}"?`,
        designation,
      },
    });
  };

  // 🗑 Step-2 — API DELETE CALL
  const deleteDesignation = async (designation) => {
    try {
      const response = await api.delete(
        `designation/Delete/${designation.id}`
      );

      if (response.status === 200) {
        toast.success("🗑️ Designation deleted successfully!");
        reloadTable();

        if (selectedDesignation?.id === designation.id) {
          handleCancel();
        }
      } else {
        toast.error("❌ Failed to delete designation!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        "❌ " +
          (error.response?.data?.message ||
            "Failed to delete designation.")
      );
    }
  };

  // 🔥 Step-3 — Handle Confirm (Modal)
  const handleModalConfirm = async () => {
    const { type, data } = modalState;

    if (type === "confirm") {
      await deleteDesignation(data.designation);
    }

    closeModal();
  };

  const closeModal = () =>
    setModalState({
      show: false,
      type: "",
      data: {},
    });

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedDesignation(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedDesignation(null);
    reloadTable();
  };

  return (
    <div className="container mt-4">
      <Card title="🏢 Designation Management" className="shadow-sm">

        {/* Header Buttons */}
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
          <DesignationForm
            key={selectedDesignation?.id || "new"}
            initialData={selectedDesignation}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <DesignationView
            designation={selectedDesignation}
            onBack={handleCancel}
          />
        ) : (
          <DesignationTable
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
