import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import api from '../../../../services/apiInterceptor';
import { InputText } from 'primereact/inputtext';

export default function DocumentTable({ onDelete, onView, onComplete }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchDocuments();
    initFilters();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`document/GetAll`);
      setDocuments(res.data.documents || []);
    } catch (error) {
      console.error("❌ Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: { value: null, matchMode: FilterMatchMode.CONTAINS },
      documentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      fromUser: { value: null, matchMode: FilterMatchMode.CONTAINS },
      createdByName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      toUserName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      priorityName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const statusTemplate = (rowData) => (
    <span
      className={`badge ${
        rowData.status === "Completed"
          ? "bg-success"
          : rowData.status === "Forwarded"
          ? "bg-primary"
          : "bg-secondary"
      }`}
    >
      {rowData.status}
    </span>
  );

  const actionBodyTemplate = (rowData) => (
    <div className="d-flex gap-2 justify-content-center">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => onView(rowData)}
        tooltip="View"
      />
      
      {/* ✅ Completed Button - Parent component se onComplete call karo */}
      <Button
        icon="pi pi-check"
        className="p-button-rounded p-button-success p-button-sm"
        onClick={() => onComplete(rowData)}
        tooltip="Mark as Completed"
        disabled={rowData.status === "Completed"}
      />

        {/* ✅ Delete button - disabled if already completed */}
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger p-button-sm"
      onClick={() => onDelete(rowData)}
      tooltip={
        rowData.status === "Completed"
          ? "Cannot delete completed document"
          : "Delete"
      }
      disabled={rowData.status === "Completed"} // 👈 Disable delete if completed
    />

    </div>
  );

  // Custom filter component
  const LargeFilter = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder={options.placeholder}
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


