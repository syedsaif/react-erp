import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import DesignationSiblingForm from "../components/DesignationSibling/DesignationSiblingForm";
import DesignationSiblingTable from "../components/DesignationSibling/DesignationSiblingTable";
import DesignationSiblingView from "../components/DesignationSibling/DesignationSiblingView";

import api from '../../../services/apiInterceptor';
import Modal from "../../../components/common/Modal";

export default function DesignationSibling() {
  const [selectedDesignationSibling, setSelectedDesignationSibling] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  // ✅ Unified modal state
  const [modalState, setModalState] = useState({ show: false, type: null, data: {} });

  const reloadTable = () => setRefreshFlag(prev => !prev);

  const handleAddNew = () => {
    setSelectedDesignationSibling(null);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedDesignationSibling(item);
    setShowView(false);
    setShowForm(true);
  };

  const handleView = (item) => {
    setSelectedDesignationSibling(item);
    setShowForm(false);
    setShowView(true);
  };

  // 🗑 Open delete confirm modal
  const handleDeleteRequest = (item) => {
    setModalState({
      show: true,
      type: 'confirm',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete designation sibling "${item.name}"?`,
        item: item,
      }
    });
  };

  // 🗑 Actual delete
  const handleDelete = async () => {
    const itemToDelete = modalState.data.item;
    if (!itemToDelete) {
      toast.error("No designation sibling selected for deletion.");
      handleModalCancel();
      return;
    }

    try {
      const response = await api.delete(`designationSibling/Delete/${itemToDelete.id}`);
      if (response.status === 200) {
        toast.success("🗑️ Designation Sibling deleted successfully!");
        reloadTable();
        if (selectedDesignationSibling?.id === itemToDelete.id) {
          handleCancel();
        }
      } else {
        toast.error("❌ Failed to delete designation sibling!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete designation sibling."));
    } finally {
      handleModalCancel();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedDesignationSibling(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedDesignationSibling(null);
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
      <Card title="👥 Designation Sibling Management" className="shadow-sm">

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
          <DesignationSiblingForm
            key={selectedDesignationSibling?.id || "new"}
            initialData={selectedDesignationSibling}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <DesignationSiblingView designationSibling={selectedDesignationSibling} onBack={handleCancel} />
        ) : (
          <DesignationSiblingTable
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
