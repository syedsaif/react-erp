import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function DocumentView({ document }) {
  const [doc, setDoc] = useState(document || null);
  const [forwards, setForwards] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!document) {
    setError("No document data provided.");
    setDoc(null);
    setForwards([]);
  } else {
    setDoc(document);
    setForwards(Array.isArray(document.documentForwards) ? document.documentForwards : []);
    setError(null);
  }
}, [document]);



  return (
    <div className="container mt-4">
      <Card title="👁️ Document Details" className="shadow-sm">
        {error ? (
          <Message severity="error" text={error} />
        ) : !doc ? (
          <Message severity="info" text="Loading document details..." />
        ) : (
          <>
            {/* <div className="p-3">
              <p><strong>Code:</strong> {doc.code}</p>
              <p><strong>Document Name:</strong> {doc.documentName}</p>
              <p><strong>Document Type:</strong> {doc.documentType}</p>
              <p><strong>From User:</strong> {doc.fromUser}</p>
              <p><strong>Created By:</strong> {doc.createdByName}</p>
              <p><strong>Assigned To:</strong> {doc.toUserName}</p>
              <p><strong>Priority Name:</strong> {doc.priorityName}</p>
              <p><strong>Status:</strong> 
                <Tag 
                  severity={
                    doc.status === "Completed" ? "success" : 
                    doc.status === "Forwarded" ? "info" : 
                    "warning"
                  } 
                  value={doc.status} 
                />
              </p>
            </div> */}

            <div className="p-3">
            <DataTable value={[doc]} size="small" responsiveLayout="scroll">
              <Column field="code" header="Code" />
              <Column field="documentName" header="Document Name" />
              <Column field="documentType" header="Document Type" />
              <Column field="fromUser" header="From User" />
              <Column field="createdByName" header="Created By" />
              <Column field="toUserName" header="Assigned To" />
              <Column field="priorityName" header="Priority" />
              <Column 
                header="Status" 
                body={() => (
                  <Tag 
                    severity={
                      doc.status === "Completed" ? "success" : 
                      doc.status === "Forwarded" ? "info" : 
                      "warning"
                    } 
                    value={doc.status} 
                  />
                )} 
              />
            </DataTable>
          </div>
            <hr />
            <h5>Attachments / Document Forwards</h5>

            {Array.isArray(forwards) && forwards.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Remarks</th>
                    <th>File Name</th>
                    <th>Download</th>
                  </tr>
                </thead>                
                <tbody>
                  {forwards.map((fwd) => (
                    <tr key={`${fwd.id}-${fwd.createdDate}`}>
                      <td>{fwd.remarks?.replace("Selected file:", "").trim()}</td>
                      <td>{fwd.fileName && fwd.fileName.trim() !== "" ? fwd.fileName : "—"}</td>
                      <td>
                        {fwd.filePath ? (
                          <a
                            href={`http://localhost:5001/${fwd.filePath.replace(/\\/g, '/')}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-button p-button-sm p-button-outlined p-button-info"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                          >
                            <i className="pi pi-download" style={{ marginRight: '5px' }}></i>
                            Download
                          </a>
                        ) : (
                          "No file"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            ) : (
              <Message severity="info" text="No document forwards found." />
            )}
          </>
        )}
      </Card>
    </div>
  );
}

