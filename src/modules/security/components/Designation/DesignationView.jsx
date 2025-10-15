import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

export default function DesignationView({ designation }) {
  const [desig, setDesig] = useState(designation || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!designation) {
      setError("No designation data provided.");
      setDesig(null);
    } else {
      setDesig(designation);
      setError(null);
    }
  }, [designation]);

  return (
    <div className="container mt-4">
      <Card title="👁️ Designation Details" className="shadow-sm">
        {error ? (
          <Message severity="error" text={error} />
        ) : !desig ? (
          <Message severity="info" text="Loading designation details..." />
        ) : (
          <div className="p-3">
            <p>
              <strong>Designation Name:</strong> {desig.name}
            </p>
            <p>
              <strong>Parent Designation:</strong> {desig.parentName || "-- None --"}
            </p>
            <p>
              <strong>Is Active:</strong>{" "}
              <Tag severity={desig.isActive ? "success" : "danger"} value={desig.isActive ? "Yes" : "No"} />
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
