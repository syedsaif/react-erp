import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import api from '../../../../services/apiInterceptor';

export default function DesignationSiblingTable({ onEdit, onDelete, onView }) {
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSiblings();
  }, []);

  const fetchSiblings = async () => {
  setLoading(true);
  try {
    const res = await api.get(`designationSibling/GetAll`);
    // Access the array inside `data` property
    setSiblings(res.data.data || []);
  } catch (error) {
    console.error("❌ Failed to fetch designation siblings:", error);
  } finally {
    setLoading(false);
    }
  };

  // Action Buttons
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

  // IsActive Badge
  const isActiveTemplate = (rowData) => (
    <span className={`badge ${rowData.isActive ? "bg-success" : "bg-danger"}`}>
      {rowData.isActive ? "Yes" : "No"}
    </span>
  );

  // Active/Inactive Dropdown Filter
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
        value={siblings}
        dataKey="id"
        paginator
        rows={10}
        loading={loading}
        stripedRows
        responsiveLayout="scroll"
        showGridlines
        emptyMessage="No designation siblings found"
        filterDisplay="row"
      >
        
        <Column
          field="designationName"
          header="Designation"
          filter
          filterPlaceholder="Search designation"
          sortable
        />
        <Column
          field="name"
          header="Designation Sibling"
          filter
          filterPlaceholder="Search name"
          sortable
        />
        <Column
          field="isActive"
          header="Is Active"
          body={isActiveTemplate}
          filter
          filterElement={isActiveFilterTemplate}
          style={{ width: "150px", textAlign: "center" }}
          sortable
        />
        <Column
          header="Actions"
          body={actionBodyTemplate}
          style={{ width: "180px", textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
}