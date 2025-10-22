import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import CompletedModal from "../../../components/common/CompletedModal";
import DocumentForm from "../../document/components/Document/DocumentForm";
import DocumentTable from "../../document/components/Document/DocumentTable";
import DocumentView from "../../document/components/Document/DocumentView";
import api from '../../../services/apiInterceptor';

export default function Document() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDocForwards, setSelectedDocForwards] = useState([]); // <-- Forwards data here
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  const reloadTable = () => setRefreshFlag((prev) => !prev);

  const handleAddNew = () => {
    setSelectedDoc(null);
    setSelectedDocForwards([]);
    setShowView(false);
    setShowForm(true);
  };

  const handleEdit = (doc) => {
    setSelectedDoc(doc);
    setSelectedDocForwards([]);
    setShowView(false);
    setShowForm(true);
  };

//   const handleView = async (doc) => {
//   setShowForm(false);
//   setShowView(true);
//   setSelectedDoc(null); // reset previous document
//   try {
//     // Fetch document by ID
//     const response = await api.get(`document/GetById/${doc.id}`);

//     if (response.status === 200 && response.data && response.data.document) {
//       setSelectedDoc(response.data.document); // set full document object including forwards
//     } else {
//       toast.info("No document data found.");
//       setSelectedDoc(null);
//     }
//   } catch (error) {
//     console.error("Failed to fetch document forwards:", error);
//     toast.error("Failed to load document forwards.");
//     setSelectedDoc(null);
//   }
// };


const handleView = async (doc) => {
  setShowForm(false);
  setShowView(true);
  setSelectedDoc(null); // reset first
  setSelectedDocForwards([]); // clear previous forwards

  try {
    const response = await api.get(`document/GetById/${doc.id}`);
    if (response.status === 200) {
      // ✅ Update both
      setSelectedDoc(response.data.document);
      setSelectedDocForwards(response.data.document.documentForwards || []);
    } else {
      toast.info("No forwards found for this document.");
    }
  } catch (error) {
    console.error("Failed to fetch document forwards:", error);
    toast.error("Failed to load document forwards.");
  }
};



  const handleComplete = (doc) => {
    setSelectedDoc(doc);
    setShowCompletedModal(true);
  };

  const handleCompletionConfirm = async (completionData) => {
    try {
      const data = new FormData();
      data.append("Id", selectedDoc.id);
      data.append("Remarks", completionData.remarks);
      if (completionData.file) {
        data.append("File", completionData.file);
      }

      const response = await api.put(`document/Update`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(`✅ Document "${selectedDoc.documentName}" marked as completed!`);
        reloadTable();
        setShowCompletedModal(false);
        setSelectedDoc(null);
        setSelectedDocForwards([]);
      } else {
        toast.error("❌ Failed to mark document as completed!");
      }
    } catch (error) {
      console.error("Completion error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to mark document as completed."));
    }
  };

  const handleCloseCompletedModal = () => {
    setShowCompletedModal(false);
    setSelectedDoc(null);
    setSelectedDocForwards([]);
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const id = selectedDoc.id;
      const response = await api.delete(`document/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Document deleted successfully!");
        reloadTable();
      } else {
        toast.error("❌ Failed to delete document!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to delete document."));
    } finally {
      setShowConfirm(false);
      setSelectedDoc(null);
      setSelectedDocForwards([]);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedDoc(null);
    setSelectedDocForwards([]);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedDoc(null);
    setSelectedDocForwards([]);
    reloadTable();
  };

  return (
    <div className="container mt-4">
      <Card title="📄 Document Management" className="shadow-sm">
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
          <DocumentForm
            key={selectedDoc?.id || "new"}
            initialData={selectedDoc}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : showView ? (
            <DocumentView
              document={selectedDoc}
              documentForwardData={selectedDocForwards}
              onBack={handleCancel}
            />
        ) : (
          <DocumentTable
            key={refreshFlag}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteRequest}
            onComplete={handleComplete}
          />
        )}

        <ConfirmModal
          show={showConfirm}
          title="Confirm Deletion"
          message={
            selectedDoc
              ? `Are you sure you want to delete document "${selectedDoc.documentName}"?`
              : ""
          }
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />

        <CompletedModal
          show={showCompletedModal}
          onCancel={handleCloseCompletedModal}
          document={selectedDoc}
          onConfirm={handleCompletionConfirm}
        />
      </Card>
    </div>
  );
}
