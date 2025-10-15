import React, { useEffect, useState } from "react";
//import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import api from '../../../../services/apiInterceptor';

export default function DesignationTable({ onEdit, onDelete, onView }) {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`designation/GetAll`);
      // Assuming API returns { designations: [...] }
      setDesignations(res.data.designations || []);
    } catch (error) {
      console.error("❌ Failed to fetch designations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Action Buttons (View / Edit / Delete)
  const actionBodyTemplate = (rowData) => (
    <div className="d-flex gap-2 justify-content-center">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => onView(rowData)}
        tooltip="View"
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning p-button-sm"
        onClick={() => onEdit(rowData)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => onDelete(rowData)}
        tooltip="Delete"
      />
    </div>
  );

  // Active/Inactive Display
  const isActiveTemplate = (rowData) => (
    <span className={`badge ${rowData.isActive ? "bg-success" : "bg-danger"}`}>
      {rowData.isActive ? "Yes" : "No"}
    </span>
  );

  // Filter Dropdown for Active/Inactive
  const isActiveFilterTemplate = (options) => (
    <select
      className="form-select"
      style={{ width: '100px' }}
      value={options.value ?? ""}
      onChange={(e) => options.filterCallback(e.target.value)}
    >
      <option value="">All</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  );

  return (
    <div className="card shadow-sm">
      <DataTable
        value={designations}
        dataKey="id"
        paginator
        rows={10}
        loading={loading}
        stripedRows
        responsiveLayout="scroll"
        showGridlines
        emptyMessage="No designations found"
        filterDisplay="row"
      >
        {/* Designation Name */}
        <Column
          field="name"
          header="Designation Name"
          filter
          filterPlaceholder="Search by name"
          sortable
        />

        {/* Parent Name */}
        <Column
          field="parentName"
          header="Parent Designation"
          filter
          filterPlaceholder="Search by parent"
          sortable
        />

        {/* Is Active */}
        <Column
          field="isActive"
          header="Is Active"
          body={isActiveTemplate}
          filter
          filterElement={isActiveFilterTemplate}
          style={{ width: "150px", textAlign: "center" }}
          sortable
        />

        {/* Actions */}
        <Column
          header="Actions"
          body={actionBodyTemplate}
          style={{ width: "180px", textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
}
