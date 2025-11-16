import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Modal from "../../../components/common/Modal";
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
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ show: false, type: null, data: {} });

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
    setModalState({
      show: true,
      type: 'complete',
      data: {
        title: '✅ Mark as Completed',
        document: doc,
      }
    });
  };

  // ✅ Confirm completion
  const handleCompletionConfirm = async (completionData) => {
    const docToComplete = modalState.data.document;
    if (!docToComplete) {
      toast.error("No document selected for completion.");
      return;
    }

    try {
      const data = new FormData();
      data.append("Id", docToComplete.id);
      data.append("Remarks", completionData.remarks || "");
      if (completionData.file) {
        data.append("File", completionData.file);
      }

      const response = await api.put('document/Completed', data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(`✅ Document "${docToComplete.documentName}" marked as completed!`);

        // ✅ Optimistic UI update: update documents state to mark completed
        setDocuments(prevDocs =>
          Array.isArray(prevDocs)
            ? prevDocs.map(d =>
                d.id === docToComplete.id
                  ? { ...d, status: "Completed", isViewed: true } // button disable & viewed
                  : d
              )
            : []
        );

        // ✅ Close modal & reset selection
        handleModalCancel();
      } else {
        toast.error("❌ Failed to mark document as completed!");
      }
    } catch (error) {
      console.error("Completion error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to mark document as completed."));
    }
  };

  // Open forward modal
  const handleForwardRequest = (doc) => {
    setModalState({
      show: true,
      type: 'forward',
      data: {
        title: 'Forward Document',
        document: doc,
      }
    });
  };

  // Confirm forward
  const handleForwardConfirm = async (forwardData) => {
    const docToForward = modalState.data.document;
    if (!docToForward) {
      toast.error("No document selected for forwarding.");
      return;
    }

    try {
      const data = new FormData();
      data.append("Id", docToForward.id);
      data.append("ToUserId", forwardData.assignee);
      data.append("PriorityId", forwardData.priority);
      data.append("ToCcuser", forwardData.toCCUser.join(','));
      data.append("EmailAlert", forwardData.emailAlert);
      data.append("SmsAlert", forwardData.notificationAlert);
      data.append("Remarks", forwardData.remarks || "");
      // Assuming CreatedBy is handled by the backend or a default value is needed
      data.append("CreatedBy", 1); 

      const response = await api.post('document/Forward', data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success(`✅ Document "${docToForward.documentName}" forwarded successfully!`);
        fetchDocuments(); // Refresh the list to show status change
        handleModalCancel();
      } else {
        toast.error("❌ Failed to forward document!");
      }
    } catch (error) {
      console.error("Forwarding error:", error);
      toast.error("❌ " + (error.response?.data?.message || "Failed to forward document."));
    }
  };

  // Open delete confirm modal
  const handleDeleteRequest = (doc) => {
    setModalState({
      show: true,
      type: 'confirm',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete document "${doc.documentName}"?`,
        document: doc, // Store the doc here for the confirm handler
      }
    });
  };

  // Delete document
  const handleDelete = async () => {
    const docToDelete = modalState.data.document;
    if (!docToDelete) {
      toast.error("No document selected for deletion.");
      handleModalCancel();
      return;
    }

    try {
      const id = docToDelete.id;
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
      handleModalCancel();
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

  // --- Unified Modal Handlers ---
  const handleModalCancel = () => {
    setModalState({ show: false, type: null, data: {} });
  };

  const handleModalConfirm = (formData) => {
    if (modalState.type === 'confirm') {
      handleDelete();
    } else if (modalState.type === 'complete') {
      handleCompletionConfirm(formData);
    } else if (modalState.type === 'forward') {
      handleForwardConfirm(formData);
    }
    // Add other modal type confirmations here if needed
    // The specific handlers (handleDelete, handleCompletionConfirm) are responsible for closing the modal on success.
  };

  return (
    <div className="container mt-4">
      <Card 
        header={
          <div style={{
            background: 'linear-gradient(90deg, #0d47a1, #1976d2, #42a5f5)',
            color: '#ffffff',
            padding: '1.25rem',
            borderTopLeftRadius: '6px',
            borderTopRightRadius: '6px',
            borderBottom: '1px solid #dee2e6'
          }}>
            <h4 className="m-0">
              <i className="pi pi-file-o me-2"></i>
              Document Management
            </h4>
          </div>
        } 
        className="shadow-sm"
        pt={{ content: { className: 'p-0' } }} // Removes default padding from card content
      >
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

        <div className="p-3">
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
            onForward={handleForwardRequest} // ✅ NEW: Pass forward handler
            onStatusUpdate={handleDocumentStatusUpdate} // ✅ NEW: Pass callback to child
          />
        )}
        </div>

        {/* This single Modal component now handles all modal types */}
        {modalState.show && (
          <Modal
            show={modalState.show}
            type={modalState.type}
            onCancel={handleModalCancel}
            onConfirm={handleModalConfirm}
            {...modalState.data} // Pass title, message, document, etc.
          />
        )}
      </Card>
    </div>
  );
}