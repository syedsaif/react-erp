// import React, { useRef, useEffect, useState } from "react";
// import useForm from "../../../security/hooks/useForm";
// import { validateField } from "../../../../utils/validation";
// import { toast } from "react-toastify";
// import api from '../../../../services/apiInterceptor';

// export default function DocumentForm({ initialData = {}, onSuccess, onCancel }) {
//   const hasShownValidationToast = useRef(false);
//   const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);
//   const [priorityOptions, setPriorityOptions] = useState([]);

//   // ✅ Fetch Document Types
//   useEffect(() => {
//     async function fetchDocumentTypes() {
//       try {
//         const response = await api.get('DocumentType/GetDropdown');
        
//         if (Array.isArray(response.data)) {
//           setDocumentTypeOptions(response.data);
//         } 
//         else if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
//           setDocumentTypeOptions(response.data.dropdown);
//         }
//         else if (response.data.data && Array.isArray(response.data.data)) {
//           setDocumentTypeOptions(response.data.data);
//         }
//         else {
//           console.warn("Unexpected API format:", response.data);
//           setDocumentTypeOptions([]);
//         }
//       } catch (error) {
//         console.error("❌ Failed to load document types", error);
//         toast.error("❌ Failed to load document types");
//         setDocumentTypeOptions([]);
//       }
//     }
//     fetchDocumentTypes();
//   }, []);

//   // ✅ Fetch Users
//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const response = await api.get('User/GetDropdown');
        
//         if (Array.isArray(response.data)) {
//           setUserOptions(response.data);
//         } 
//         else if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
//           setUserOptions(response.data.dropdown);
//         }
//         else if (response.data.data && Array.isArray(response.data.data)) {
//           setUserOptions(response.data.data);
//         }
//         else {
//           setUserOptions([]);
//         }
//       } catch (error) {
//         console.error("❌ Failed to load users", error);
//         toast.error("❌ Failed to load users");
//         setUserOptions([]);
//       }
//     }
//     fetchUsers();
//   }, []);

//   // ✅ Fetch Priorities
//   useEffect(() => {
//   async function fetchPriorities() {
//     try {
//       const response = await api.get('Priority/GetDropdown');
      
//       if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
//         setPriorityOptions(response.data.dropdown);
//       } else {
//         setPriorityOptions([]);
//       }
//     } catch (error) {
//       console.error("❌ Failed to load priorities", error);
//       toast.error("❌ Failed to load priorities");
//       setPriorityOptions([]);
//     }
//   }
//   fetchPriorities();
// }, []);

//   const validate = (data) => {
//     let errors = {};

//     errors = {
//       ...errors,
//       ...validateField({
//         name: "documentName",
//         value: data.documentName,
//         type: "text",
//         label: "Document Name",
//         minLength: 3,
//       }),
//       ...validateField({
//         name: "fromUser",
//         value: data.fromUser,
//         type: "text",
//         label: "From User",
//         required: true,
//         minLength: 2,
//       }),
//       ...validateField({
//         name: "assignee",
//         value: data.assignee,
//         type: "dropdown",
//         label: "Assignee",
//         required: true,
//       }),
//       ...validateField({
//         name: "priority",
//         value: data.priority,
//         type: "dropdown",
//         label: "Priority",
//         required: true,
//       }),
//       ...validateField({
//         name: "documentType",
//         value: data.documentType,
//         type: "dropdown",
//         label: "Document Type",
//         required: true,
//       }),
//     };

//     return errors;
//   };

//   const { formData, errors, handleChange, handleSubmit, loading } = useForm(
//     {
//       id: initialData?.id ?? 0,
//       documentName: initialData?.documentName || "",
//       fromUser: initialData?.fromUser || "",
//       assignee: initialData?.assignee || "",
//       priority: initialData?.priority || "",
//       toCCUser: initialData?.toCCUser || [],
//       selectedEmails: initialData?.selectedEmails || "",
//       emailAlert: initialData?.emailAlert || false,
//       notificationAlert: initialData?.notificationAlert || false,
//       fileAttached: null,
//       remarks: initialData?.remarks || "",
//       documentType: initialData?.documentType || "",
//     },
//     validate,
//     async (data) => {
//       try {
//         const formDataToSend = new FormData();

//         formDataToSend.append("Id", data.id || 0);
//         formDataToSend.append("Code", "DOC-90");
//         formDataToSend.append("DocumentName", data.documentName || "");
//         formDataToSend.append("FromUser", data.fromUser || "");
//         formDataToSend.append("ToUserId", data.assignee || ""); // ✅ Use selected assignee
//         formDataToSend.append("ToCcuser", data.selectedEmails || "");
//         formDataToSend.append("PriorityId", data.priority || ""); // ✅ Use selected priority
//         formDataToSend.append("EmailAlert", data.emailAlert);
//         formDataToSend.append("SmsAlert", data.notificationAlert);
//         formDataToSend.append("Remarks", data.remarks || "");
//         formDataToSend.append("CreatedBy", 1);
//         formDataToSend.append("DocumentTypeId", data.documentType || "");

//         if (data.fileAttached && typeof data.fileAttached !== "string") {
//           formDataToSend.append("File", data.fileAttached);
//         }

//         const response = await api.post("document/Insert", formDataToSend, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         toast.success(response.data.message || "✅ Document created successfully!");
//         if (onSuccess) onSuccess();
//         hasShownValidationToast.current = false;
//       } catch (error) {
//         console.error("❌ Document save error:", error);
//         const serverMsg = error.response?.data?.message || error.response?.data?.Message;
//         toast.error(serverMsg ? "❌ " + serverMsg : "🚨 Internal Server Error. Please try again.");
//       }
//     }
//   );

//   const shownErrors = React.useRef(new Set());
  
//   React.useEffect(() => {
//     Object.entries(errors).forEach(([field, message]) => {
//       if (message && !shownErrors.current.has(field)) {
//         toast.error(message);
//         shownErrors.current.add(field);
//       }
//     });

//     if (Object.keys(errors).length === 0) {
//       shownErrors.current.clear();
//     }
//   }, [errors]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleChange({
//         target: {
//           name: "fileAttached",
//           value: file
//         }
//       });
//     }
//   };

//   const handleToCCUserChange = (e) => {
//     const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
//     handleChange({
//       target: {
//         name: "toCCUser",
//         value: selectedOptions
//       }
//     });
//   };

//   //✅ Remove hardcoded options - now using API data
//   const toCCUserOptions = [
//     { value: "a@a.com", label: "John (a@a.com)" },
//     { value: "b@b.com", label: "Jane (b@b.com)" },
//   ];

//   return (
//     <form onSubmit={handleSubmit} noValidate>
//       <div className="row g-3">
//         {/* Document Name */}
//         <div className="col-md-6">
//           <label>Document Name</label>
//           <input
//             type="text"
//             name="documentName"
//             value={formData.documentName}
//             onChange={handleChange}
//             className={`form-control ${errors.documentName ? "is-invalid" : ""}`}
//           />
//         </div>

//         {/* From User */}
//         <div className="col-md-6">
//           <label>From User</label>
//           <input
//             type="text"
//             name="fromUser"
//             value={formData.fromUser}
//             onChange={handleChange}
//             className={`form-control ${errors.fromUser ? "is-invalid" : ""}`}
//           />
//         </div>

//         {/* ✅ Assignee - Now from API */}
//         <div className="col-md-6">
//           <label>Assignee</label>
//           <select
//             name="assignee"
//             value={formData.assignee}
//             onChange={handleChange}
//             className={`form-control ${errors.assignee ? "is-invalid" : ""}`}
//           >
//             <option value="">Select Assignee</option>
//             {userOptions.map(user => (
//               <option key={user.id} value={user.id}>
//                 {user.fullName || user.name || user.userName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ✅ Priority - Now from API */}
//         <div className="col-md-6">
//           <label>Priority</label>
//           <select
//             name="priority"
//             value={formData.priority}
//             onChange={handleChange}
//             className={`form-control ${errors.priority ? "is-invalid" : ""}`}
//           >
//             <option value="">Select Priority</option>
//               {priorityOptions.map(p => (
//             <option key={p.id} value={p.id}>
//               {p.Priority}
//             </option>
//             ))}
//           </select>
//         </div>

//         {/* CC Users (Multi select) */}
//         <div className="col-md-6">
//           <label>To CC User</label>
//           <select
//             name="toCCUser"
//             multiple
//             value={formData.toCCUser}
//             onChange={handleToCCUserChange}
//             className="form-control"
//             size="4"
//           >
//             {toCCUserOptions.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         </div>

//         {/* ✅ Document Type - Now from API */}
//         <div className="col-md-6">
//           <label>Document Type</label>
//           <select
//             name="documentType"
//             value={formData.documentType}
//             onChange={handleChange}
//             className={`form-control ${errors.documentType ? "is-invalid" : ""}`}
//           >
//             <option value="">Select Document Type</option>
//             {documentTypeOptions.map(docType => (
//               <option key={docType.id} value={docType.id}>
//                 {docType.documentType || docType.type || docType.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Selected Emails (comma-separated) */}
//         <div className="col-md-6">
//           <label>Selected Emails</label>
//           <input
//             type="text"
//             name="selectedEmails"
//             value={formData.selectedEmails}
//             onChange={handleChange}
//             className="form-control"
//             placeholder="email1@example.com,email2@example.com"
//           />
//         </div>

//         {/* Alerts */}
//         <div className="col-md-6">
//           <div className="form-check">
//             <input
//               type="checkbox"
//               name="emailAlert"
//               checked={formData.emailAlert}
//               onChange={handleChange}
//               className="form-check-input"
//               id="emailAlert"
//             />
//             <label className="form-check-label" htmlFor="emailAlert">Email Alert</label>
//           </div>

//           <div className="form-check">
//             <input
//               type="checkbox"
//               name="notificationAlert"
//               checked={formData.notificationAlert}
//               onChange={handleChange}
//               className="form-check-input"
//               id="notificationAlert"
//             />
//             <label className="form-check-label" htmlFor="notificationAlert">Notification Alert</label>
//           </div>
//         </div>

//         {/* File Upload */}
//         <div className="col-md-6">
//           <label>Attach File</label>
//           <input
//             type="file"
//             name="fileAttached"
//             className="form-control"
//             onChange={handleFileChange}
//           />
//           {formData.fileAttached && (
//             <small className="text-muted">
//               Selected file: {formData.fileAttached.name || formData.fileAttached}
//             </small>
//           )}
//         </div>

//         {/* Remarks */}
//         <div className="col-12">
//           <label>Remarks</label>
//           <textarea
//             name="remarks"
//             className="form-control"
//             value={formData.remarks}
//             onChange={handleChange}
//             rows="3"
//             placeholder="Enter any remarks or notes"
//           />
//         </div>
//       </div>

//       {/* Submit / Cancel */}
//       <div className="mt-4">
//         <button
//           type="submit"
//           className="btn btn-primary"
//           disabled={loading}
//         >
//           💾 {loading ? "Saving..." : formData.id ? "Update" : "Save"}
//         </button>
//         <button
//           type="button"
//           className="btn btn-secondary ms-2"
//           onClick={onCancel}
//           disabled={loading}
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }


import React, { useRef, useEffect, useState } from "react";
import useForm from "../../../security/hooks/useForm";
import { validateField } from "../../../../utils/validation";
import { toast } from "react-toastify";
import api from '../../../../services/apiInterceptor';

export default function DocumentForm({ initialData = {}, onSuccess, onCancel }) {
  const hasShownValidationToast = useRef(false);

  // ✅ States
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [toCCUserOptions, setToCCUserOptions] = useState([]); // ✅ New

  // ✅ Fetch Document Types
  useEffect(() => {
    async function fetchDocumentTypes() {
      try {
        const response = await api.get('DocumentType/GetDropdown');
        if (Array.isArray(response.data)) {
          setDocumentTypeOptions(response.data);
        } else if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
          setDocumentTypeOptions(response.data.dropdown);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setDocumentTypeOptions(response.data.data);
        } else {
          console.warn("Unexpected API format:", response.data);
          setDocumentTypeOptions([]);
        }
      } catch (error) {
        console.error("❌ Failed to load document types", error);
        toast.error("❌ Failed to load document types");
        setDocumentTypeOptions([]);
      }
    }
    fetchDocumentTypes();
  }, []);

  // ✅ Fetch Users (for Assignee)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('User/GetDropdown');
        if (Array.isArray(response.data)) {
          setUserOptions(response.data);
        } else if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
          setUserOptions(response.data.dropdown);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setUserOptions(response.data.data);
        } else {
          setUserOptions([]);
        }
      } catch (error) {
        console.error("❌ Failed to load users", error);
        toast.error("❌ Failed to load users");
        setUserOptions([]);
      }
    }
    fetchUsers();
  }, []);

  // ✅ Fetch Priorities
  useEffect(() => {
    async function fetchPriorities() {
      try {
        const response = await api.get('Priority/GetDropdown');
        if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
          setPriorityOptions(response.data.dropdown);
        } else {
          setPriorityOptions([]);
        }
      } catch (error) {
        console.error("❌ Failed to load priorities", error);
        toast.error("❌ Failed to load priorities");
        setPriorityOptions([]);
      }
    }
    fetchPriorities();
  }, []);

  // ✅ Fetch CC Users (for To CC User dropdown)
  useEffect(() => {
    async function fetchCCUsers() {
      try {
        const response = await api.get('User/GetDropdown');
        if (Array.isArray(response.data)) {
          setToCCUserOptions(response.data);
        } else if (response.data.dropdown && Array.isArray(response.data.dropdown)) {
          setToCCUserOptions(response.data.dropdown);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setToCCUserOptions(response.data.data);
        } else {
          setToCCUserOptions([]);
        }
      } catch (error) {
        console.error("❌ Failed to load CC users", error);
        toast.error("❌ Failed to load CC users");
        setToCCUserOptions([]);
      }
    }
    fetchCCUsers();
  }, []);

  // ✅ Validation rules (no validation for CC users)
  const validate = (data) => {
    let errors = {};

    errors = {
      ...errors,
      ...validateField({
        name: "documentName",
        value: data.documentName,
        type: "text",
        label: "Document Name",
        minLength: 3,
      }),
      ...validateField({
        name: "fromUser",
        value: data.fromUser,
        type: "text",
        label: "From User",
        required: true,
        minLength: 2,
      }),
      ...validateField({
        name: "assignee",
        value: data.assignee,
        type: "dropdown",
        label: "Assignee",
        required: true,
      }),
      ...validateField({
        name: "priority",
        value: data.priority,
        type: "dropdown",
        label: "Priority",
        required: true,
      }),
      ...validateField({
        name: "documentType",
        value: data.documentType,
        type: "dropdown",
        label: "Document Type",
        required: true,
      }),
    };

    return errors;
  };

  // ✅ useForm hook
  const { formData, errors, handleChange, handleSubmit, loading } = useForm(
    {
      id: initialData?.id ?? 0,
      documentName: initialData?.documentName || "",
      fromUser: initialData?.fromUser || "",
      assignee: initialData?.assignee || "",
      priority: initialData?.priority || "",
      toCCUser: initialData?.toCCUser || [],
      selectedEmails: initialData?.selectedEmails || "",
      emailAlert: initialData?.emailAlert || false,
      notificationAlert: initialData?.notificationAlert || false,
      fileAttached: null,
      remarks: initialData?.remarks || "",
      documentType: initialData?.documentType || "",
    },
    validate,
    async (data) => {
      try {
        const formDataToSend = new FormData();

        formDataToSend.append("Id", data.id || 0);
        formDataToSend.append("Code", "DOC-90");
        formDataToSend.append("DocumentName", data.documentName || "");
        formDataToSend.append("FromUser", data.fromUser || "");
        formDataToSend.append("ToUserId", data.assignee || "");
        formDataToSend.append("ToCcuser", data.selectedEmails || "");
        formDataToSend.append("PriorityId", data.priority || "");
        formDataToSend.append("EmailAlert", data.emailAlert);
        formDataToSend.append("SmsAlert", data.notificationAlert);
        formDataToSend.append("Remarks", data.remarks || "");
        formDataToSend.append("CreatedBy", 1);
        formDataToSend.append("DocumentTypeId", data.documentType || "");

        if (data.fileAttached && typeof data.fileAttached !== "string") {
          formDataToSend.append("File", data.fileAttached);
        }

        const response = await api.post("document/Insert", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(response.data.message || "✅ Document created successfully!");
        if (onSuccess) onSuccess();
        hasShownValidationToast.current = false;
      } catch (error) {
        console.error("❌ Document save error:", error);
        const serverMsg = error.response?.data?.message || error.response?.data?.Message;
        toast.error(serverMsg ? "❌ " + serverMsg : "🚨 Internal Server Error. Please try again.");
      }
    }
  );

  // ✅ Show validation errors once
  const shownErrors = React.useRef(new Set());
  React.useEffect(() => {
    Object.entries(errors).forEach(([field, message]) => {
      if (message && !shownErrors.current.has(field)) {
        toast.error(message);
        shownErrors.current.add(field);
      }
    });

    if (Object.keys(errors).length === 0) {
      shownErrors.current.clear();
    }
  }, [errors]);

  // ✅ File change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange({ target: { name: "fileAttached", value: file } });
    }
  };

  // ✅ To CC User change handler (multiple + comma-separated)
  const handleToCCUserChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    handleChange({ target: { name: "toCCUser", value: selectedOptions } });
    handleChange({ target: { name: "selectedEmails", value: selectedOptions.join(",") } });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">

        {/* Document Name */}
        <div className="col-md-6">
          <label>Document Name</label>
          <input
            type="text"
            name="documentName"
            value={formData.documentName}
            onChange={handleChange}
            className={`form-control ${errors.documentName ? "is-invalid" : ""}`}
          />
        </div>

        {/* From User */}
        <div className="col-md-6">
          <label>From User</label>
          <input
            type="text"
            name="fromUser"
            value={formData.fromUser}
            onChange={handleChange}
            className={`form-control ${errors.fromUser ? "is-invalid" : ""}`}
          />
        </div>

        {/* Assignee */}
        <div className="col-md-6">
          <label>Assignee</label>
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className={`form-control ${errors.assignee ? "is-invalid" : ""}`}
          >
            <option value="">Select Assignee</option>
            {userOptions.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.name || user.userName}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="col-md-6">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`form-control ${errors.priority ? "is-invalid" : ""}`}
          >
            <option value="">Select Priority</option>
            {priorityOptions.map(p => (
              <option key={p.id} value={p.id}>
                {p.Priority}
              </option>
            ))}
          </select>
        </div>

        {/* To CC User (multi-select, from API) */}
        <div className="col-md-6">
          <label>To CC User</label>
          <select
            name="toCCUser"
            multiple
            value={formData.toCCUser}
            onChange={handleToCCUserChange}
            className="form-control"
            size="4"
          >
            {toCCUserOptions.map(user => (
              <option key={user.id} value={user.email || user.userName || user.fullName}>
                {user.fullName || user.name || user.userName}
              </option>
              // ✅ NEW - User ID bhejein
              /*{ {toCCUserOptions.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.name || user.userName}
              </option> }*/
                ))}
          </select>
        </div>

        {/* Selected Emails */}
        <div className="col-md-6">
          <label>Selected Emails</label>
          <input
            type="text"
            name="selectedEmails"
            value={formData.selectedEmails}
            onChange={handleChange}
            className="form-control"
            placeholder="email1@example.com,email2@example.com"
          />
        </div>

        {/* Document Type */}
        <div className="col-md-6">
          <label>Document Type</label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className={`form-control ${errors.documentType ? "is-invalid" : ""}`}
          >
            <option value="">Select Document Type</option>
            {documentTypeOptions.map(docType => (
              <option key={docType.id} value={docType.id}>
                {docType.documentType || docType.type || docType.name}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts */}
        <div className="col-md-6">
          <div className="form-check">
            <input
              type="checkbox"
              name="emailAlert"
              checked={formData.emailAlert}
              onChange={handleChange}
              className="form-check-input"
              id="emailAlert"
            />
            <label className="form-check-label" htmlFor="emailAlert">Email Alert</label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              name="notificationAlert"
              checked={formData.notificationAlert}
              onChange={handleChange}
              className="form-check-input"
              id="notificationAlert"
            />
            <label className="form-check-label" htmlFor="notificationAlert">Notification Alert</label>
          </div>
        </div>

        {/* File Upload */}
        <div className="col-md-6">
          <label>Attach File</label>
          <input
            type="file"
            name="fileAttached"
            className="form-control"
            onChange={handleFileChange}
          />
          {formData.fileAttached && (
            <small className="text-muted">
              Selected file: {formData.fileAttached.name || formData.fileAttached}
            </small>
          )}
        </div>

        {/* Remarks */}
        <div className="col-12">
          <label>Remarks</label>
          <textarea
            name="remarks"
            className="form-control"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            placeholder="Enter any remarks or notes"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          💾 {loading ? "Saving..." : formData.id ? "Update" : "Save"}
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}