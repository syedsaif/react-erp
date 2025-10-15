import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";

export default function GenderView({ gender }) {
  const [gen, setGen] = useState(gender || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gender) {
      setError("No gender data provided.");
    } else {
      setGen(gender);
      setError(null);
    }
  }, [gender]);

  return (
    <div className="container mt-4">
      <Card title="👁️ Gender Details" className="shadow-sm">
        {error ? (
          <Message severity="error" text={error} />
        ) : !gen ? (
          <Message severity="info" text="Loading gender details..." />
        ) : (
          <div className="p-3">
            <p>
              <strong>Gender Name:</strong> {gen.name}
            </p>
            <p>
              <strong>Is Active:</strong>{" "}
              <Tag
                severity={gen.isActive ? "success" : "danger"}
                value={gen.isActive ? "Yes" : "No"}
              />
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}