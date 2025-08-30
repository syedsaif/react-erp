import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

export default function RoleViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;

  if (!role) {
    return (
      <div className="container mt-4">
        <Card title="👁️ View Role">
          <Message severity="error" text="No role data found." />
          <Button
            label="← Back"
            icon="pi pi-arrow-left"
            className="p-button-secondary mt-3"
            onClick={() => navigate(-1)}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card title="👁️ View Role">
        <div className="p-2">
          <p>
            <strong>Role Name:</strong> {role.roleName}
          </p>
          <p>
            <strong>Is Active:</strong>{" "}
            <Tag
              severity={role.isActive ? "success" : "danger"}
              value={role.isActive ? "Yes" : "No"}
            />
          </p>
        </div>

        <Button
          label="← Back"
          icon="pi pi-arrow-left"
          className="p-button-secondary mt-3"
          onClick={() => navigate(-1)}
        />
      </Card>
    </div>
  );
}
