// import React, { useRef, useEffect, useState } from "react";
// import useForm from "../../../security/hooks/useForm";
// import { validateField } from "../../../../utils/validation";
// import { MultiSelect } from 'primereact/multiselect';
// import { toast } from "react-toastify";
// import { getDocumentTypes, getUsers, getPriorities, saveDocument } from "../../../../APICalls/DocumentFormAPI";

// export default function DocumentForm({ initialData = {}, onSuccess, onCancel }) {
//   const hasShownValidationToast = useRef(false);

//   // ✅ States
//   const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);
//   const [priorityOptions, setPriorityOptions] = useState([]);
//   const [toCCUserOptions, setToCCUserOptions] = useState([]); // ✅ New
//   const [isSubmitted, setIsSubmitted] = useState(false); // ✅ Track if form has been submitted

//   // ✅ Fetch Document Types
//   useEffect(() => {
//     const fetchAndSetDocumentTypes = async () => {
//       const data = await getDocumentTypes();
//       setDocumentTypeOptions(data);
//     };
//     fetchAndSetDocumentTypes();
//   }, []);

//   // ✅ Fetch Users (for Assignee)
//   useEffect(() => {
//     const fetchAndSetUsers = async () => {
//       const data = await getUsers();
//       setUserOptions(data);
//     };
//     fetchAndSetUsers();
    
//   }, []);

//   // ✅ Fetch Priorities
//   useEffect(() => {
//     const fetchAndSetPriorities = async () => {
//       const data = await getPriorities();
//       setPriorityOptions(data);
//     };
//     fetchAndSetPriorities();
    
//   }, []);

//   // ✅ Fetch CC Users (for To CC User dropdown)
//   useEffect(() => {
//     const fetchAndSetCCUsers = async () => {
//       const data = await getUsers(); // Reusing the getUsers function
//       setToCCUserOptions(data);
//     };
//     fetchAndSetCCUsers();
    
//   }, []);

//   // ✅ Validation rules (no validation for CC users)
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

//   // ✅ useForm hook
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
//         // Prepare form data for submission
//         const formDataToSend = new FormData();
//         formDataToSend.append("Id", data.id || 0);
//         formDataToSend.append("Code", "DOC-90");
//         formDataToSend.append("DocumentName", data.documentName || "");
//         formDataToSend.append("FromUser", data.fromUser || "");
//         formDataToSend.append("ToUserId", data.assignee || "");
//         formDataToSend.append("ToCcuser", data.selectedEmails || "");
//         formDataToSend.append("PriorityId", data.priority || "");
//         formDataToSend.append("EmailAlert", data.emailAlert);
//         formDataToSend.append("SmsAlert", data.notificationAlert);
//         formDataToSend.append("Remarks", data.remarks || "");
//         formDataToSend.append("CreatedBy", 1);
//         formDataToSend.append("DocumentTypeId", data.documentType || "");
//         if (data.fileAttached && typeof data.fileAttached !== "string") {
//           formDataToSend.append("File", data.fileAttached);
//         }

//         // Call the centralized API function
//         const response = await saveDocument(formDataToSend);
//         toast.success(response.data.message || "✅ Document created successfully!");
        
//         if (onSuccess) onSuccess();
//         hasShownValidationToast.current = false;
//       } catch (error) {
//         // Error is already handled and toasted in the API function
//         console.error("Form submission failed in DocumentForm:", error);
//       }
//     }
//   );

//   // ✅ File change handler
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleChange({ target: { name: "fileAttached", value: file } });
//     }
//   };

//   // ✅ To CC User change handler (multiple + comma-separated)
//   const handleToCCUserChange = (e) => {
//     const selectedUsers = e.value; // `e.value` is an array of selected user IDs
//     handleChange({ target: { name: "toCCUser", value: selectedUsers } });

//     // Find the full user objects for the selected IDs to get their emails
//     const selectedUserEmails = toCCUserOptions
//       .filter(user => selectedUsers.includes(user.id))
//       .map(user => user.email || user.userName || user.fullName)
//       .join(',');

//     handleChange({ target: { name: "selectedEmails", value: selectedUserEmails } });
//   };

//   // ✅ New handleSubmit wrapper to show toasts on every click
//   const handleFormSubmit = (e) => {
//     setIsSubmitted(true); // Mark form as submitted to show red borders
//     const validationErrors = validate(formData); // Run validation
//     if (Object.keys(validationErrors).length > 0) { // Check if there are errors
//       e.preventDefault(); // Prevent form submission if validation fails
//       // Show a toast for each validation error
//       Object.values(validationErrors).forEach(errorMessage => {
//         toast.error(errorMessage);
//       });
//     }
//     handleSubmit(e); // Always call the hook's handleSubmit to update the 'errors' state for UI
//   };

//   return (
//     <form onSubmit={handleFormSubmit} noValidate>
//       <div className="row g-3 align-items-center">

//         {/* Document Name */}
//         <div className="col-md-6">
//           <label>Document Name <span className="text-danger">*</span></label>
//           <input
//             type="text"
//             name="documentName"
//             value={formData.documentName}
//             onChange={handleChange}
//             className={`form-control ${isSubmitted && errors.documentName ? "is-invalid" : ""}`}
//           />
//         </div>

//         {/* From User */}
//         <div className="col-md-6">
//           <label>From User <span className="text-danger">*</span></label>
//           <input
//             type="text"
//             name="fromUser"
//             value={formData.fromUser}
//             onChange={handleChange}
//             className={`form-control ${isSubmitted && errors.fromUser ? "is-invalid" : ""}`}
//           />
//         </div>

//         {/* Assignee */}
//         <div className="col-md-6">
//           <label>Assignee <span className="text-danger">*</span></label>
//           <select
//             name="assignee"
//             value={formData.assignee}
//             onChange={handleChange}
//             className={`form-control ${isSubmitted && errors.assignee ? "is-invalid" : ""}`}
//           >
//             <option value="">Select Assignee</option>
//             {userOptions.map(user => (
//               <option key={user.id} value={user.id}>
//                 {user.fullName || user.name || user.userName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Priority */}
//         <div className="col-md-6">
//           <label>Priority <span className="text-danger">*</span></label>
//           <select
//             name="priority"
//             value={formData.priority}
//             onChange={handleChange}
//             className={`form-control ${isSubmitted && errors.priority ? "is-invalid" : ""}`}
//           >
//             <option value="">Select Priority</option>
//             {priorityOptions.map(p => (
//               <option key={p.id} value={p.id}>
//                 {p.Priority}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* To CC User (multi-select, from API) */}
//         <div className="col-md-6">
//           <label>To CC User</label>
//           <MultiSelect
//             value={formData.toCCUser}
//             options={toCCUserOptions}
//             onChange={handleToCCUserChange}
//             optionLabel="fullName" // The property to display in the dropdown
//             optionValue="id"       // The property to use as the value for each option
//             placeholder="Search and select users"
//             filter
//             display="chip" // Shows selected items as chips
//             className="w-100"
//             itemTemplate={(option) => (
//               <div>{option.fullName} ({option.email})</div>
//             )}
//           />
//         </div>

//         {/* Selected Emails */}
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

//         {/* Document Type */}
//         <div className="col-md-6">
//           <label>Document Type <span className="text-danger">*</span></label>
//           <select
//             name="documentType"
//             value={formData.documentType}
//             onChange={handleChange}
//             className={`form-control ${isSubmitted && errors.documentType ? "is-invalid" : ""}`}
//           >
//             <option value="">Select Document Type</option>
//             {documentTypeOptions.map(docType => (
//               <option key={docType.id} value={docType.id}>
//                 {docType.documentType || docType.type || docType.name}
//               </option>
//             ))}
//           </select>
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

//       {/* Buttons */}
//       <div className="mt-4">
//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           💾 {loading ? "Saving..." : formData.id ? "Update" : "Save"}
//         </button>
//         <button type="button" className="btn btn-secondary ms-2" onClick={onCancel} disabled={loading}>
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

import React, { useRef, useEffect, useState } from "react";
import useForm from "../../../security/hooks/useForm";
import { validateField } from "../../../../utils/validation";
import { MultiSelect } from 'primereact/multiselect';
import { toast } from "react-toastify";
import { getDocumentTypes, getUsers, getPriorities, saveDocument } from "../../../../APICalls/DocumentFormAPI";

export default function DocumentForm({ initialData = {}, onSuccess, onCancel }) {
  const hasShownValidationToast = useRef(false);

  // ✅ States
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [toCCUserOptions, setToCCUserOptions] = useState([]); // CC Users
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

  // ✅ Fetch Document Types
  useEffect(() => {
    const fetchAndSetDocumentTypes = async () => {
      const data = await getDocumentTypes();
      setDocumentTypeOptions(data);
    };
    fetchAndSetDocumentTypes();
  }, []);

  // ✅ Fetch Users (for Assignee)
  useEffect(() => {
    const fetchAndSetUsers = async () => {
      const data = await getUsers();
      setUserOptions(data);
      setToCCUserOptions(data); // Same users for CC dropdown
    };
    fetchAndSetUsers();
  }, []);

  // ✅ Fetch Priorities
  useEffect(() => {
    const fetchAndSetPriorities = async () => {
      const data = await getPriorities();
      setPriorityOptions(data);
    };
    fetchAndSetPriorities();
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
      toCCUser: initialData?.toCCUser || [], // ✅ Only IDs
      emailAlert: initialData?.emailAlert || false,
      notificationAlert: initialData?.notificationAlert || false,
      fileAttached: null,
      remarks: initialData?.remarks || "",
      documentType: initialData?.documentType || "",
    },
    validate,
    async (data) => {
      try {
        // Prepare form data for submission
        const formDataToSend = new FormData();
        formDataToSend.append("Id", data.id || 0);
        formDataToSend.append("Code", "DOC-90");
        formDataToSend.append("DocumentName", data.documentName || "");
        formDataToSend.append("FromUser", data.fromUser || "");
        formDataToSend.append("ToUserId", data.assignee || "");
        formDataToSend.append("ToCcuser", data.toCCUser || ""); // Only send IDs
        formDataToSend.append("PriorityId", data.priority || "");
        formDataToSend.append("EmailAlert", data.emailAlert);
        formDataToSend.append("SmsAlert", data.notificationAlert);
        formDataToSend.append("Remarks", data.remarks || "");
        formDataToSend.append("CreatedBy", 1);
        formDataToSend.append("DocumentTypeId", data.documentType || "");
        if (data.fileAttached && typeof data.fileAttached !== "string") {
          formDataToSend.append("File", data.fileAttached);
        }

        const response = await saveDocument(formDataToSend);
        toast.success(response.data.message || "✅ Document saved successfully!");
        
        if (onSuccess) onSuccess();
        hasShownValidationToast.current = false;
      } catch (error) {
        console.error("Form submission failed in DocumentForm:", error);
      }
    }
  );

  // ✅ File change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange({ target: { name: "fileAttached", value: file } });
    }
  };

  // ✅ To CC User change handler (just IDs, no emails field)
  const handleToCCUserChange = (e) => {
    const selectedUsers = e.value; // array of selected user IDs
    handleChange({ target: { name: "toCCUser", value: selectedUsers } });
  };

  // ✅ Form submit wrapper
  const handleFormSubmit = (e) => {
    setIsSubmitted(true);
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      Object.values(validationErrors).forEach(errorMessage => toast.error(errorMessage));
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <div className="row g-3 align-items-center">

        {/* Document Name */}
        <div className="col-md-6">
          <label>Document Name <span className="text-danger">*</span></label>
          <input
            type="text"
            name="documentName"
            value={formData.documentName}
            onChange={handleChange}
            className={`form-control ${isSubmitted && errors.documentName ? "is-invalid" : ""}`}
          />
        </div>

        {/* From User */}
        <div className="col-md-6">
          <label>From User <span className="text-danger">*</span></label>
          <input
            type="text"
            name="fromUser"
            value={formData.fromUser}
            onChange={handleChange}
            className={`form-control ${isSubmitted && errors.fromUser ? "is-invalid" : ""}`}
          />
        </div>

        {/* Assignee */}
        <div className="col-md-6">
          <label>Assignee <span className="text-danger">*</span></label>
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className={`form-control ${isSubmitted && errors.assignee ? "is-invalid" : ""}`}
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
          <label>Priority <span className="text-danger">*</span></label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`form-control ${isSubmitted && errors.priority ? "is-invalid" : ""}`}
          >
            <option value="">Select Priority</option>
            {priorityOptions.map(p => (
              <option key={p.id} value={p.id}>
                {p.Priority}
              </option>
            ))}
          </select>
        </div>

        {/* To CC User */}
        <div className="col-md-6">
          <label>To CC User</label>
          {/* <MultiSelect
            value={formData.toCCUser}
            options={toCCUserOptions}
            onChange={handleToCCUserChange}
            optionLabel="fullName"
            optionValue="id"
            placeholder="Search and select users"
            filter
            display="chip"
            className="w-100"
            itemTemplate={(option) => (
              <div>{option.fullName} ({option.email})</div>
            )}
          /> */}
          <MultiSelect
            value={formData.toCCUser}
            options={toCCUserOptions}
            onChange={handleToCCUserChange}
            optionLabel="fullName"
            optionValue="id"
            placeholder="Search and select users"
            filter
            display="chip"
            className="w-100 multiselect-auto-height"
            appendTo={document.body}
            itemTemplate={(option) => (
                <div>{option.fullName} ({option.email})</div>
              )}
          />

        </div>

        {/* Document Type */}
        <div className="col-md-6">
          <label>Document Type <span className="text-danger">*</span></label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className={`form-control ${isSubmitted && errors.documentType ? "is-invalid" : ""}`}
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
