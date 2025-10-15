import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import GenderForm from "../components/Gender/GenderForm";
import GenderTable from "../components/Gender/GenderTable";
import GenderView from "../components/Gender/GenderView";
import api from '../../../services/apiInterceptor';

export default function Gender() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ new

  const reloadTable = () => setRefreshFlag((prev) => !prev);

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

  // 🗑️ Open confirm modal
  const handleDeleteRequest = (gender) => {
    setSelectedGender(gender);
    setShowConfirm(true);
  };

  // 🗑️ Actual delete
  const handleDelete = async () => {
    try {
      const id = selectedGender.id;
      const response = await api.delete(`gender/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Gender deleted successfully!");
        reloadTable();
      } else {
        toast.error("❌ Failed to delete gender!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete gender."));
    } finally {
      setShowConfirm(false);
      setSelectedGender(null);
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

  return (
    <div className="container mt-4">
      <Card title="🚻 Gender Management" className="shadow-sm">
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

        {/* ✅ Confirm Modal render */}
        <ConfirmModal
          show={showConfirm}
          title="Confirm Deletion"
          message={
            selectedGender
              ? `Are you sure you want to delete gender "${selectedGender.name}"?`
              : ""
          }
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </Card>
    </div>
  );
}
