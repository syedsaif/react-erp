// import React, { useEffect, useState } from "react";
// import { Card } from "primereact/card";
// import { Tag } from "primereact/tag";
// import { Message } from "primereact/message";

// export default function DocumentView({ document, documentForwardData, onBack }) {
//   const [doc, setDoc] = useState(document || null);
//   const [forwards, setForwards] = useState(documentForwardData || []);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!document) {
//       setError("No document data provided.");
//       setDoc(null);
//       setForwards([]);
//     } else {
//       setDoc(document);
//       setForwards(documentForwardData || []);
//       setError(null);
//     }
//   }, [document, documentForwardData]);

//   return (
//     <div className="container mt-4">
//       <Card title="👁️ Document Details" className="shadow-sm">
//         <button onClick={onBack} className="p-button p-button-secondary mb-3">
//           ← Back to List
//         </button>

//         {error ? (
//           <Message severity="error" text={error} />
//         ) : !doc ? (
//           <Message severity="info" text="Loading document details..." />
//         ) : (
//           <>
//             <div className="p-3">
//               <p><strong>Code:</strong> {doc.code}</p>
//               <p><strong>Document Name:</strong> {doc.documentName}</p>
//               <p><strong>From User:</strong> {doc.fromUser}</p>
//               <p><strong>Assigned To:</strong> {doc.toUserName}</p>
//               <p><strong>Status:</strong> 
//                 <Tag 
//                   severity={
//                     doc.status === "Completed" ? "success" : 
//                     doc.status === "Forwarded" ? "info" : 
//                     "warning"
//                   } 
//                   value={doc.status} 
//                 />
//               </p>
//               {/* Add other document fields as needed */}
//             </div>

//             <hr />

//             <h5>Attachments / Document Forwards</h5>

//             {forwards.length === 0 ? (
//               <Message severity="info" text="No document forwards found." />
//             ) : (
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>Remarks</th>
//                     <th>File Name</th>
//                     <th>Download</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {forwards.map((fwd) => (
//                     <tr key={fwd.id}>
//                       <td>{fwd.remarks}</td>
//                       <td>{fwd.fileName}</td>
//                       <td>
//                         {fwd.filePath ? (
//                         //   <a
//                         //     href={`https://yourdomain.com/${fwd.filePath}`} // Replace with your actual base URL
//                         //     download
//                         //     target="_blank"
//                         //     rel="noopener noreferrer"
//                         //     className="p-button p-button-text"
//                         //   >
//                         //     Download
//                         //   </a>
//                         <a
//                             href={`http://localhost:5001/${fwd.filePath.replace(/\\/g, '/')}`}
//                             download
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="p-button p-button-text"
//                             >
//                             Download
//                             </a>

//                         ) : (
//                           "No file"
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";
import { Button } from "primereact/button";

export default function DocumentView({ document }) {
  const [doc, setDoc] = useState(document || null);
  const [forwards, setForwards] = useState([]);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!document) {
//       setError("No document data provided.");
//       setDoc(null);
//       setForwards([]);
//     } else {
//       setDoc(document);

//       // ✅ Safely extract documentForwards
//       const forwardsArray = Array.isArray(document.documentForwards)
//         ? document.documentForwards
//         : [];
//       setForwards(forwardsArray);

//       setError(null);
//     }
//   }, [document]);

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
        {/* <button onClick={onBack} className="p-button p-button-secondary mb-3">
          ← Back to List
        </button> */}

        {error ? (
          <Message severity="error" text={error} />
        ) : !doc ? (
          <Message severity="info" text="Loading document details..." />
        ) : (
          <>
            <div className="p-3">
              <p><strong>Code:</strong> {doc.code}</p>
              <p><strong>Document Name:</strong> {doc.documentName}</p>
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
                    <tr key={fwd.id}>
                      <td>{fwd.remarks}</td>
                      <td>{fwd.fileName}</td>
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

