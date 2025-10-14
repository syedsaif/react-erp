import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

export default function DepartmentView({ department }) {
  const [dept, setDept] = useState(department || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!department) {
      setError("No department data provided.");
    } else {
      setDept(department);
      setError(null);
    }
  }, [department]);

  return (
    <div className="container mt-4">
      <Card title="👁️ Department Details" className="shadow-sm">
        {error ? (
          <Message severity="error" text={error} />
        ) : !dept ? (
          <Message severity="info" text="Loading department details..." />
        ) : (
          <div className="p-3">
            <p>
              <strong>Department Name:</strong> {dept.name}
            </p>
            <p>
              <strong>Is Active:</strong>{" "}
              <Tag
                severity={dept.isActive ? "success" : "danger"}
                value={dept.isActive ? "Yes" : "No"}
              />
            </p>
          </div>
        )}
        
      </Card>
    </div>
  );
}