import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import EducationForm from "../components/Education/EducationForm";
import EducationTable from "../components/Education/EducationTable";
import EducationView from "../components/Education/EducationView";
import api from '../../../services/apiInterceptor';

export default function Education() {
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ new

  const reloadTable = () => setRefreshFlag((prev) => !prev);

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

  // 🗑️ Open confirm modal
  const handleDeleteRequest = (education) => {
    setSelectedEducation(education);
    setShowConfirm(true);
  };

  // 🗑️ Actual delete
  const handleDelete = async () => {
    try {
      const id = selectedEducation.id;
      const response = await api.delete(`education/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Education deleted successfully!");
        reloadTable();
      } else {
        toast.error("❌ Failed to delete education!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete education."));
    } finally {
      setShowConfirm(false);
      setSelectedEducation(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedEducation(null);
  };

  const handleSuccess = () => {
    //toast.success("✅ Education saved successfully!");
    setShowForm(false);
    setSelectedEducation(null);
    reloadTable();
  };

  return (
    <div className="container mt-4">
      <Card title="🏫 Education Management" className="shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">
          </h5>

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

        {/* ✅ Confirm Modal render */}
        <ConfirmModal
          show={showConfirm}
          title="Confirm Deletion"
          message={
            selectedEducation
              ? `Are you sure you want to delete education "${selectedEducation.name}"?`
              : ""
          }
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </Card>
    </div>
  );
}