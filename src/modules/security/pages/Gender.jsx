import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import GenderForm from "../components/Gender/GenderForm";
import GenderTable from "../components/Gender/GenderTable";
import GenderView from "../components/Gender/GenderView";

import api from '../../../services/apiInterceptor';
import Modal from "../../../components/common/Modal";

export default function Gender() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  // ✅ Unified modal state
  const [modalState, setModalState] = useState({ show: false, type: null, data: {} });

  const reloadTable = () => setRefreshFlag(prev => !prev);

  const handleAddNew = () => {
    setSelectedGender(null);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (gender) => {
    setSelectedGender(gender);
    setShowView(false);
    setShowForm(true);
  };

  const handleView = (gender) => {
    setSelectedGender(gender);
    setShowForm(false);
    setShowView(true);
  };

  // 🗑 Open confirm modal
  const handleDeleteRequest = (gender) => {
    setModalState({
      show: true,
      type: 'confirm',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete gender "${gender.name}"?`,
        item: gender,
      }
    });
  };

  // 🗑 Actual delete call
  const handleDelete = async () => {
    const itemToDelete = modalState.data.item;
    if (!itemToDelete) {
      toast.error("No gender selected for deletion.");
      handleModalCancel();
      return;
    }

    try {
      const response = await api.delete(`gender/Delete/${itemToDelete.id}`);
      if (response.status === 200) {
        toast.success("🗑️ Gender deleted successfully!");
        reloadTable();
        if (selectedGender?.id === itemToDelete.id) {
          handleCancel();
        }
      } else {
        toast.error("❌ Failed to delete gender!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete gender."));
    } finally {
      handleModalCancel();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedGender(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedGender(null);
    reloadTable();
  };

  // --- Unified Modal Handlers ---
  const handleModalCancel = () => setModalState({ show: false, type: null, data: {} });

  const handleModalConfirm = () => {
    if (modalState.type === 'confirm') {
      handleDelete();
    }
  };

  return (
    <div className="container mt-4">
      <Card title="🚻 Gender Management" className="shadow-sm">

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
          <GenderForm
            key={selectedGender?.id || "new"}
            initialData={selectedGender}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <GenderView gender={selectedGender} onBack={handleCancel} />
        ) : (
          <GenderTable
            key={refreshFlag}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteRequest}
          />
        )}

        {/* 🔥 Unified Modal */}
        <Modal
          show={modalState.show}
          type={modalState.type}
          title={modalState.data.title}
          message={modalState.data.message}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      </Card>
    </div>
  );
}
