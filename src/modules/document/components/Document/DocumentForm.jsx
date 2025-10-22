import React, { useRef } from "react";
import useForm from "../../../security/hooks/useForm";
import { validateField } from "../../../../utils/validation";
import { toast } from "react-toastify";
import api from '../../../../services/apiInterceptor';

export default function DocumentForm({ initialData = {}, onSuccess, onCancel }) {
  const hasShownValidationToast = useRef(false);

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
    };

    return errors;
  };

  const { formData, errors, handleChange, handleSubmit, loading } = useForm(
    {
      id: initialData?.id ?? 0,
      documentName: initialData?.documentName || "",
      fromUser: initialData?.fromUser || "",
      assignee: initialData?.assignee || "", // should be numeric ID (string or number)
      priority: initialData?.priority || "", // should be numeric ID (string or number)
      toCCUser: initialData?.toCCUser || [],
      selectedEmails: initialData?.selectedEmails || "",
      emailAlert: initialData?.emailAlert || false,
      notificationAlert: initialData?.notificationAlert || false,
      fileAttached: null,
      remarks: initialData?.remarks || "",
    },
    validate,
    async (data) => {
  try {
    const formDataToSend = new FormData();

    formDataToSend.append("Id", data.id || 0);
    formDataToSend.append("Code", "DOC-90");
    formDataToSend.append("DocumentName", data.documentName || "");
    formDataToSend.append("FromUser", data.fromUser || "");
    formDataToSend.append("ToUserId", 355); // Replace with actual user selection
    formDataToSend.append("ToCcuser", data.selectedEmails || "");
    formDataToSend.append("PriorityId", 2); // Replace with mapped value from dropdown
    formDataToSend.append("EmailAlert", data.emailAlert);
    formDataToSend.append("SmsAlert", data.notificationAlert);
    formDataToSend.append("Remarks", data.remarks || "");
    formDataToSend.append("CreatedBy", 1); // OR get from context

    // File (if any)
    if (data.fileAttached && typeof data.fileAttached !== "string") {
      formDataToSend.append("File", data.fileAttached); // 👈 must match DTO field name
    }

    const response = await api.post("document/Insert", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

 const shownErrors = React.useRef(new Set());
 
 React.useEffect(() => {
   // Loop through all current errors
   Object.entries(errors).forEach(([field, message]) => {
     if (message && !shownErrors.current.has(field)) {
       toast.error(message);
       shownErrors.current.add(field); // mark this field as shown
     }
   });
 
   // Reset when no errors left
   if (Object.keys(errors).length === 0) {
     shownErrors.current.clear();
   }
 }, [errors]);

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    handleChange({
      target: {
        name: "fileAttached",
        value: file // ⬅️ Store file, not file.name
      }
    });
  }
};


  const handleToCCUserChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    handleChange({
      target: {
        name: "toCCUser",
        value: selectedOptions
      }
    });
  };

  // Replace these with actual ID-based values
  const assigneeOptions = [
    { value: "", label: "Select Assignee" },
    { value: "101", label: "John Doe" },
    { value: "102", label: "Jane Smith" },
  ];

  const priorityOptions = [
    { value: "", label: "Select Priority" },
    { value: "1", label: "Low" },
    { value: "2", label: "Medium" },
    { value: "3", label: "High" },
    { value: "4", label: "Urgent" },
  ];

  const toCCUserOptions = [
    { value: "a@a.com", label: "John (a@a.com)" },
    { value: "b@b.com", label: "Jane (b@b.com)" },
  ];

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
            {assigneeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* CC Users (Multi select) */}
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
            {toCCUserOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Selected Emails (comma-separated) */}
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

      {/* Submit / Cancel */}
      <div className="mt-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          💾 {loading ? "Saving..." : formData.id ? "Update" : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

