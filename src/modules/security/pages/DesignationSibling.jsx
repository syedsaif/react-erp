import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DesignationSiblingForm from "../components/DesignationSibling/DesignationSiblingForm";
import DesignationSiblingTable from "../components/DesignationSibling/DesignationSiblingTable";
import DesignationSiblingView from "../components/DesignationSibling/DesignationSiblingView";
import api from '../../../services/apiInterceptor';

export default function DesignationSibling() {
  const [selectedDesignationSibling, setSelectedDesignationSibling] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const reloadTable = () => setRefreshFlag((prev) => !prev);

  const handleAddNew = () => {
    setSelectedDesignationSibling(null);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (designationSibling) => {
    setSelectedDesignationSibling(designationSibling);
    setShowView(false);
    setShowForm(true);
  };

  const handleView = (designationSibling) => {
    setSelectedDesignationSibling(designationSibling);
    setShowForm(false);
    setShowView(true);
  };
  const handleDeleteRequest = (designationSibling) => {
    setSelectedDesignationSibling(designationSibling);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const id = selectedDesignationSibling.id;
      const response = await api.delete(`designationSibling/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Designation Sibling deleted successfully!");
        reloadTable();
      } else {
        toast.error("❌ Failed to delete designation sibling!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete designation sibling."));
    } finally {
      setShowConfirm(false);
      setSelectedDesignationSibling(null);
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

  return (
    <div className="container mt-4">
      <Card title="👥 Designation Sibling Management" className="shadow-sm">
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
          <DesignationSiblingForm
            key={selectedDesignationSibling?.id || "new"}
            initialData={selectedDesignationSibling}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
          <DesignationSiblingView designationSibling={selectedDesignationSibling} onBack={handleCancel} />
        ) : 
        (
          <DesignationSiblingTable
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
            selectedDesignationSibling
              ? `Are you sure you want to delete designation sibling "${selectedDesignationSibling.name}"?`
              : ""
          }
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </Card>
    </div>
  );
}
