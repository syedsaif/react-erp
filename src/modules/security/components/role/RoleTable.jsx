import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function RoleTable({ roles, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleView = (role) => {
    navigate(`/roles/view/${role.id}`, { state: { role } });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="d-flex gap-2">
      <Button
        icon="pi pi-eye"
        className="p-button-sm p-button-info"
        onClick={() => handleView(rowData)}
        tooltip="View"
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-warning"
        onClick={() => onEdit(rowData)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-danger"
        onClick={() => onDelete(rowData)}
        tooltip="Delete"
      />
    </div>
  );

  const isActiveTemplate = (rowData) =>
    rowData.isActive ? "Yes" : "No";

  const isActiveFilterTemplate = (options) => (
    <select
      className="form-select"
      value={options.value ?? ""}
      onChange={(e) => options.filterCallback(e.target.value)}
    >
      <option value="">All</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  );

  return (
    <div className="card">
      <DataTable
        value={roles}
        dataKey="id"
        paginator
        rows={10}
        stripedRows
        responsiveLayout="scroll"
        showGridlines
        emptyMessage="No roles found"
        filterDisplay="row"
      >
        <Column
          header="#"
          body={(rowData, options) => options.rowIndex + 1}
          style={{ width: "60px" }}
        />
        <Column
          field="roleName"
          header="Role Name"
          filter
          filterPlaceholder="Search by name"
        />
        <Column
          field="isActive"
          header="Is Active"
          body={isActiveTemplate}
          filter
          filterElement={isActiveFilterTemplate}
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
