import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function DepartmentTable({ onEdit, onDelete, onView }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_APIURL}department/GetAll`);
      setDepartments(res.data.departments || []);
    } catch (error) {
      console.error("❌ Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Action Buttons (View / Edit / Delete)
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

  // ✅ Active/Inactive Display
  const isActiveTemplate = (rowData) => (
    <span className={`badge ${rowData.isActive ? "bg-success" : "bg-danger"}`}>
      {rowData.isActive ? "Yes" : "No"}
    </span>
  );

  // ✅ Filter Dropdown for Active/Inactive
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
        value={departments}
        dataKey="id"
        paginator
        rows={10}
        loading={loading}
        stripedRows
        responsiveLayout="scroll"
        showGridlines
        emptyMessage="No departments found"
        filterDisplay="row"
      >
        {/* <Column
          header="#"
          body={(rowData, options) => options.rowIndex + 1}
          style={{ width: "60px", textAlign: "center" }}
        /> */}
        <Column
          field="name"
          header="Department Name"
          filter
          filterPlaceholder="Search by name"
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