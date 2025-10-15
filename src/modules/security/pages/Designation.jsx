import React, { useState } from "react";
import { toast } from "react-toastify";
//import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DesignationForm from "../components/Designation/DesignationForm";
import DesignationTable from "../components/Designation/DesignationTable";
import DesignationView from "../components/Designation/DesignationView";
import api from '../../../services/apiInterceptor';

export default function Designation() {
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleDeleteRequest = (designation) => {
    setSelectedDesignation(designation);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const id = selectedDesignation.id;
      const response = await api.delete(`designation/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Designation deleted successfully!");
        reloadTable();
      } else {
        toast.error("❌ Failed to delete designation!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete designation."));
    } finally {
      setShowConfirm(false);
      setSelectedDesignation(null);
    }
  };

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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0"></h5>

          {!showForm && !showView && (
            <Button
              label="Add New"
              icon="pi pi-plus"
              className="p-button-success"
              onClick={handleAddNew}
            />
          )}
          {(showForm || showView) && (
            <Button
              label="Back to List"
              icon="pi pi-arrow-left"
              className="p-button-secondary"
              onClick={handleCancel}
            />
          )}
        </div>

        {showForm ? (
          <DesignationForm
            key={selectedDesignation?.id || "new"}
            initialData={selectedDesignation}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <DesignationView designation={selectedDesignation} onBack={handleCancel} />
        ) : (
          <DesignationTable
            key={refreshFlag}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteRequest}
          />
        )}

        <ConfirmModal
          show={showConfirm}
          title="Confirm Deletion"
          message={
            selectedDesignation
              ? `Are you sure you want to delete designation "${selectedDesignation.name}"?`
              : ""
          }
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </Card>
    </div>
  );
}
