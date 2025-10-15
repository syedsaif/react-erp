import React, { useRef } from "react";
import useForm from "../../hooks/useForm";
import { validateField } from "../../../../utils/validation";
import { toast } from "react-toastify";
import api from '../../../../services/apiInterceptor';

export default function EducationForm({ initialData = {}, onSuccess, onCancel }) {
  const hasShownValidationToast = useRef(false);

  const validate = (data) => {
    let errors = {};
    errors = {
      ...errors,
      ...validateField({
        name: "name",
        value: data.name,
        type: "text",
        label: "Education Name",
        minLength: 3,
      }),
    };
    return errors;
  };

  const { formData, errors, handleChange, handleSubmit, loading } = useForm(
    {
      id: initialData?.id ?? 0,
      name: initialData?.name || "",
      isActive: initialData?.isActive ?? true,
    },
    validate,
    async (data) => {
      try {
        const payload = {
          Id: data.id,
          Name: data.name,
          IsActive: data.isActive,
        };

        let response;

        if (data.id && data.id !== 0) {
          response = await api.put(`education/Update`, payload);
          toast.success(response.data.Message || "✅ Education updated successfully!");
        } else {
          response = await api.post(`education/Insert`, payload);
          toast.success(response.data.message || "✅ Education created successfully!");
        }

        if (onSuccess) onSuccess();
        hasShownValidationToast.current = false;
      } catch (error) {
        console.error("Education save error:", error);
        const serverMsg = error.response?.data?.message || error.response?.data?.Message;
        toast.error(serverMsg ? "❌ " + serverMsg : "🚨 Internal Server Error. Please try again.");
      }
    }
  );

  React.useEffect(() => {
    if (Object.keys(errors).length > 0 && !hasShownValidationToast.current) {
      const firstError = Object.values(errors)[0];
      if (firstError) toast.error(firstError);
      hasShownValidationToast.current = true;
    }
  }, [errors]);

  return (
    <div className="form-section border p-4 mb-3 bg-light rounded">
      <h5>{formData.id && formData.id !== 0 ? "✏️ Edit Education" : "➕ Add Education"}</h5>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Education Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="col-md-6 d-flex align-items-center mt-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="isActive"
                className="form-check-input"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isActive">
                Is Active?
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            💾 {loading ? "Saving..." : formData.id && formData.id !== 0 ? "Update" : "Save"}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}