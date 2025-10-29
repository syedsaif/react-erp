import React, { useEffect, useState } from "react";
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
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDocForwards, setSelectedDocForwards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('document/GetAll');
      if (response.status === 200) {
        setDocuments(response.data.documents || response.data || []);
      } else {
        toast.error("Failed to load documents.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ✅ NEW: Function for child component to update document status
  const handleDocumentStatusUpdate = (docId, newStatus) => {
    setDocuments(prevDocs =>
      Array.isArray(prevDocs)
        ? prevDocs.map(d =>
            d.id === docId 
              ? { ...d, status: newStatus, isViewed: true }
              : d
          )
        : []
    );
  };

  // Add New document
  const handleAddNew = () => {
    setSelectedDoc(null);
    setSelectedDocForwards([]);
    setShowView(false);
    setShowForm(true);
  };

  // Edit document
  const handleEdit = (doc) => {
    setSelectedDoc(doc);
    setSelectedDocForwards([]);
    setShowView(false);
    setShowForm(true);
  };

  // View document details + forwards
  const handleViewDetails = async (doc) => {
    setShowForm(false);
    setShowView(true);
    setSelectedDoc(null);
    setSelectedDocForwards([]);

    try {
      const response = await api.get(`document/GetById/${doc.id}`);
      if (response.status === 200) {
        setSelectedDoc(response.data.document || response.data);
        setSelectedDocForwards(response.data.document?.documentForwards || response.data.documentForwards || []);
      } else {
        toast.info("No forwards found for this document.");
      }
    } catch (error) {
      console.error("Failed to fetch document forwards:", error);
      toast.error("Failed to load document forwards.");
    }
  };

  // ✅ Mark document as viewed - UPDATED
  const handleView = async (doc) => {
    try {
      const response = await api.put('document/Viewed', { Id: doc.id }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success(`✅ Document "${doc.documentName}" marked as viewed!`);

        // ✅ Update documents state immediately
        setDocuments(prevDocs =>
          Array.isArray(prevDocs)
            ? prevDocs.map(d => d.id === doc.id ? { ...d, isViewed: true } : d)
            : []
        );
      } else {
        toast.error("❌ Failed to mark document as viewed!");
      }
    } catch (error) {
      console.error("View action error:", error);
      toast.error("❌ Failed to mark document as viewed.");
    }
  };

  // ✅ Open complete modal
  const handleComplete = (doc) => {
    setSelectedDoc(doc);
    setShowCompletedModal(true);
  };

  // ✅ Confirm completion
  const handleCompletionConfirm = async (completionData, e) => {
    e?.preventDefault(); // Prevent form submit from refreshing page

    if (!selectedDoc) {
      toast.error("No document selected for completion.");
      return;
    }

    try {
      const data = new FormData();
      data.append("Id", selectedDoc.id);
      data.append("Remarks", completionData.remarks || "");
      if (completionData.file) {
        data.append("File", completionData.file);
      }

      const response = await api.put('document/Completed', data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(`✅ Document "${selectedDoc.documentName}" marked as completed!`);

        // ✅ Optimistic UI update: update documents state to mark completed
        setDocuments(prevDocs =>
          Array.isArray(prevDocs)
            ? prevDocs.map(d =>
                d.id === selectedDoc.id
                  ? { ...d, status: "Completed", isViewed: true } // button disable & viewed
                  : d
              )
            : []
        );

        // ✅ Close modal & reset selection
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

  // ✅ Close completed modal manually
  const handleCloseCompletedModal = () => {
    setShowCompletedModal(false);
    setSelectedDoc(null);
    setSelectedDocForwards([]);
  };

  // Open delete confirm modal
  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setShowConfirm(true);
  };

  // Delete document
  const handleDelete = async () => {
    if (!selectedDoc) {
      toast.error("No document selected for deletion.");
      setShowConfirm(false);
      return;
    }

    try {
      const id = selectedDoc.id;
      const response = await api.delete(`document/Delete/${id}`);
      if (response.status === 200) {
        toast.success("🗑️ Document deleted successfully!");
        setDocuments(prevDocs =>
          Array.isArray(prevDocs) ? prevDocs.filter(d => d.id !== id) : []
        );
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

  // Cancel form/view
  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setSelectedDoc(null);
    setSelectedDocForwards([]);
  };

  // After add/edit success
  const handleSuccess = () => {
    setShowForm(false);
    setSelectedDoc(null);
    setSelectedDocForwards([]);
    fetchDocuments();  // reload fresh list
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
            documents={documents} // ✅ Documents prop pass
            loading={loading} // ✅ Loading prop pass
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onView={handleView} // ✅ Updated handleView function pass
            onDelete={handleDeleteRequest}
            onComplete={handleComplete}
            onStatusUpdate={handleDocumentStatusUpdate} // ✅ NEW: Pass callback to child
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