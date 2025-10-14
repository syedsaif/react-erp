import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DepartmentForm from "../components/Department/DepartmentForm";
import DepartmentTable from "../components/Department/DepartmentTable";
import DepartmentView from "../components/Department/DepartmentView";

export default function Department() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ new
  const apiUrl = import.meta.env.VITE_APIURL;

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

  // 🗑️ Open confirm modal
  const handleDeleteRequest = (dept) => {
    setSelectedDept(dept);
    setShowConfirm(true);
  };

  // 🗑️ Actual delete
  const handleDelete = async () => {
    try {
      const id = selectedDept.id;
      const response = await axios.delete(`${apiUrl}department/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Department deleted successfully!");
        reloadTable();
      } else {
        toast.error("❌ Failed to delete department!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete department."));
    } finally {
      setShowConfirm(false);
      setSelectedDept(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedDept(null);
  };

  const handleSuccess = () => {
    //toast.success("✅ Department saved successfully!");
    setShowForm(false);
    setSelectedDept(null);
    reloadTable();
  };

  return (
    <div className="container mt-4">
      <Card title="🏢 Department Management" className="shadow-sm">
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

        {/* ✅ Confirm Modal render */}
        <ConfirmModal
          show={showConfirm}
          title="Confirm Deletion"
          message={
            selectedDept
              ? `Are you sure you want to delete department "${selectedDept.name}"?`
              : ""
          }
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </Card>
    </div>
  );
}