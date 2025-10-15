import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

export default function EducationView({ education }) {
  const [edu, setEdu] = useState(education || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!education) {
      setError("No education data provided.");
    } else {
      setEdu(education);
      setError(null);
    }
  }, [education]);

  return (
    <div className="container mt-4">
      <Card title="👁️ Education Details" className="shadow-sm">
        {error ? (
          <Message severity="error" text={error} />
        ) : !edu ? (
          <Message severity="info" text="Loading education details..." />
        ) : (
          <div className="p-3">
            <p>
              <strong>Education Name:</strong> {edu.name}
            </p>
            <p>
              <strong>Is Active:</strong>{" "}
              <Tag
                severity={edu.isActive ? "success" : "danger"}
                value={edu.isActive ? "Yes" : "No"}
              />
            </p>
          </div>
        )}
        
      </Card>
    </div>
  );
}