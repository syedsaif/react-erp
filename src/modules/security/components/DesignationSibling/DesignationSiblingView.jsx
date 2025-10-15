import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

export default function DesignationSiblingView({ designationSibling }) {
  const [sibling, setSibling] = useState(designationSibling || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!designationSibling) {
      setError("No designation sibling data provided.");
      setSibling(null);
    } else {
      setSibling(designationSibling);
      setError(null);
    }
  }, [designationSibling]);

  return (
    <div className="container mt-4">
      <Card title="👁️ Designation Sibling Details" className="shadow-sm">
        {error ? (
          <Message severity="error" text={error} />
        ) : !sibling ? (
          <Message severity="info" text="Loading designation sibling details..." />
        ) : (
          <div className="p-3">
            <p>
              <strong>Designation Sibling Name:</strong> {sibling.name}
            </p>
            <p>
              <strong>Linked Designation:</strong> {sibling.designationName || "-- None --"}
            </p>
            <p>
              <strong>Is Active:</strong>{" "}
              <Tag
                severity={sibling.isActive ? "success" : "danger"}
                value={sibling.isActive ? "Yes" : "No"}
              />
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}