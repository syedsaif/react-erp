import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import api from '../../../../services/apiInterceptor';
import { InputText } from 'primereact/inputtext';
import { toast } from "react-toastify";

export default function DocumentTable({ 
  onDelete, 
  onViewDetails, 
  onComplete, 
  onStatusUpdate, // ✅ NEW: Added callback from parent
  documents, // ✅ NEW: Receive documents from parent instead of fetching here
  loading // ✅ NEW: Receive loading state from parent
}) {
  const [filters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    documentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fromUser: { value: null, matchMode: FilterMatchMode.CONTAINS },
    createdByName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    toUserName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    priorityName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    documentType: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // ✅ REMOVED: Local documents state and fetchDocuments
  // const [documents, setDocuments] = useState([]);
  // const [loading, setLoading] = useState(false);

  // ✅ REMOVED: useEffect and fetchDocuments since data comes from parent now

  const statusTemplate = (rowData) => (
    <span
      className={`badge ${
        rowData.status === "Completed"
          ? "bg-success"
          : rowData.status === "Forwarded"
          ? "bg-primary"
          : "bg-secondary"
      }`}
      aria-label={`Status: ${rowData.status}`}
    >
      {rowData.status}
    </span>
  );

  const handleView = async (doc) => {
    try {
      const data = { Id: doc.id };
      const response = await api.put(`document/Viewed`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // ✅ Update via parent callback instead of local state
        if (onStatusUpdate) {
          onStatusUpdate(doc.id, doc.status, true); // Pass isViewed=true
        }
        
        toast.success(`✅ Document "${doc.documentName}" marked as viewed!`);
      } else {
        toast.error("❌ Failed to mark document as viewed!");
      }
    } catch (error) {
      console.error("View action error:", error);
      toast.error("❌ Failed to mark document as viewed.");
    }
  };

  // ✅ NEW: Handle complete with proper callback
  const handleComplete = async (rowData) => {
    try {
      // Call parent's complete handler (which opens modal)
      if (onComplete) {
        onComplete(rowData);
        return true; // Return success since modal will handle the actual completion
      }
      return false;
    } catch (error) {
      console.error("Complete action error:", error);
      return false;
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div className="d-flex gap-2 justify-content-center">
      {/* View Details Button */}
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => onViewDetails(rowData)}
        tooltip="View Details"
        aria-label={`View details of ${rowData.documentName}`}
      />

      {/* Mark as Viewed Button */}
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-success p-button-sm"
        onClick={() => handleView(rowData)}
        tooltip="Mark as Viewed"
        disabled={rowData.isViewed === true}
        aria-label={
          rowData.isViewed
            ? `${rowData.documentName} is already viewed`
            : `Mark ${rowData.documentName} as viewed`
        }
      />

      {/* Mark as Completed Button - UPDATED */}
      <Button
        type="button"
        icon="pi pi-check"
        className="p-button-rounded p-button-success p-button-sm"
        onClick={async () => {
          await handleComplete(rowData);
          // ✅ No need for optimistic update here anymore
          // Parent's handleComplete will open modal and handle the update
        }}
        tooltip="Mark as Completed"
        disabled={rowData.status?.trim().toLowerCase() === "completed"}
        aria-label={
          rowData.status?.toLowerCase() === "completed"
            ? `${rowData.documentName} is already completed`
            : `Mark ${rowData.documentName} as completed`
        }
      />

      {/* Delete Button */}
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => onDelete(rowData)}
        tooltip="Delete"
        aria-label={`Delete document ${rowData.documentName}`}
      />
    </div>
  );

  // Custom input filter component for columns - with accessibility improvements
  const LargeFilter = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder={options.placeholder}
        aria-label={`Filter by ${options.placeholder}`}
        style={{
          width: '100%',
          minWidth: '120px',
          padding: '10px 14px',
          fontSize: '14px',
          height: '40px'
        }}
      />
    );
  };

  return (
    <div className="card shadow-sm" style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '1200px' }}>
        <DataTable
          value={documents}
          dataKey="id"
          paginator
          rows={5}
          loading={loading}
          stripedRows
          showGridlines
          emptyMessage="No documents found"
          responsiveLayout="scroll"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "code",
            "documentName",
            "fromUser",
            "createdByName",
            "toUserName",
            "priorityName",
            "status",
            "documentType",
          ]}
        >
          <Column
            field="code"
            header="Code"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search code"
            style={{ width: "200px", whiteSpace: "nowrap" }}
          />

          <Column
            field="documentName"
            header="Document Name"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search name"
            style={{ width: "250px", whiteSpace: "nowrap" }}
          />

          <Column
            field="documentType"
            header="Document Type"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search name"
            style={{ width: "250px", whiteSpace: "nowrap" }}
          />

          <Column
            field="fromUser"
            header="From User"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search sender"
            style={{ width: "220px", whiteSpace: "nowrap" }}
          />

          <Column
            field="createdByName"
            header="Created By"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search creator"
            style={{ width: "220px", whiteSpace: "nowrap" }}
          />

          <Column
            field="toUserName"
            header="Assigned To"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search assignee"
            style={{ width: "220px", whiteSpace: "nowrap" }}
          />

          <Column
            field="priorityName"
            header="Priority"
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search priority"
            style={{ width: "200px", whiteSpace: "nowrap" }}
          />

          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
            filter
            filterElement={LargeFilter}
            filterPlaceholder="Search status"
            style={{ width: "160px", whiteSpace: "nowrap" }}
          />

          <Column
            header="Actions"
            body={actionBodyTemplate}
            style={{ width: "220px", textAlign: "center", whiteSpace: "nowrap" }}
          />
        </DataTable>
      </div>
    </div>
  );
}


