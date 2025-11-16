import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import EducationForm from "../components/Education/EducationForm";
import EducationTable from "../components/Education/EducationTable";
import EducationView from "../components/Education/EducationView";

import api from '../../../services/apiInterceptor';
import Modal from "../../../components/common/Modal";

export default function Education() {
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  // ✅ Unified modal state
  const [modalState, setModalState] = useState({ show: false, type: null, data: {} });

  const reloadTable = () => setRefreshFlag(prev => !prev);

  const handleAddNew = () => {
    setSelectedEducation(null);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (education) => {
    setSelectedEducation(education);
    setShowView(false);
    setShowForm(true);
  };

  const handleView = (education) => {
    setSelectedEducation(education);
    setShowForm(false);
    setShowView(true);
  };

  // 🗑 Open confirm modal
  const handleDeleteRequest = (education) => {
    setModalState({
      show: true,
      type: 'confirm',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete education "${education.name}"?`,
        item: education,
      }
    });
  };

  // 🗑 Actual delete call
  const handleDelete = async () => {
    const itemToDelete = modalState.data.item;
    if (!itemToDelete) {
      toast.error("No education selected for deletion.");
      handleModalCancel();
      return;
    }

    try {
      const response = await api.delete(`education/Delete/${itemToDelete.id}`);
      if (response.status === 200) {
        toast.success("🗑️ Education deleted successfully!");
        reloadTable();
        if (selectedEducation?.id === itemToDelete.id) {
          handleCancel();
        }
      } else {
        toast.error("❌ Failed to delete education!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete education."));
    } finally {
      handleModalCancel();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedEducation(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedEducation(null);
    reloadTable();
  };

  // Modal handlers
  const handleModalCancel = () => setModalState({ show: false, type: null, data: {} });

  const handleModalConfirm = () => {
    if (modalState.type === 'confirm') {
      handleDelete();
    }
  };

  return (
    <div className="container mt-4">
      <Card title="🏫 Education Management" className="shadow-sm">

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
          <EducationForm
            key={selectedEducation?.id || "new"}
            initialData={selectedEducation}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <EducationView education={selectedEducation} onBack={handleCancel} />
        ) : (
          <EducationTable
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
