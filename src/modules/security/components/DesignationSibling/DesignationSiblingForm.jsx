import React, { useRef, useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import { validateField } from "../../../../utils/validation";
import { toast } from "react-toastify";
import api from '../../../../services/apiInterceptor';

export default function DesignationSiblingForm({ initialData = {}, onSuccess, onCancel }) {
  const hasShownValidationToast = useRef(false);
  const [designations, setDesignations] = useState([]);

  // ✅ Fetch Designations
  useEffect(() => {
    async function fetchDesignations() {
      try {
        const companyId = localStorage.getItem("companyId") || 1;
        const response = await api.get(`designation/GetDropdown?companyId=${companyId}`);
        setDesignations(response?.data?.designations || []);
      } catch (error) {
        console.error("❌ Failed to load designations", error);
        toast.error("❌ Failed to load designations");
      }
    }

    fetchDesignations();
  }, []);

  // ✅ Validation
  const validate = (data) => {
    let errors = {};

    errors = {
      ...errors,
      ...validateField({
        name: "name",
        value: data.name,
        type: "text",
        label: "Sibling Name",
        minLength: 3,
      }),
    };

    errors = {
      ...errors,
      ...validateField({
        name: "designationId",
        value: data.designationId,
        type: "dropdown", // 👈 important
        label: "Designation",
      }),
    };

    return errors;
  };

  // ✅ Form hook
  const { formData, errors, handleChange, handleSubmit, loading } = useForm(
    {
      id: initialData?.id ?? 0,
      designationId: initialData?.designationId ?? -1,
      name: initialData?.name || "",
      isActive: initialData?.isActive ?? true,
      designationName: "asd",
    },
    validate,
    async (data) => {
      try {
        const payload = {
          DesignationId: Number(data.designationId),
          Name: data.name,
          IsActive: data.isActive,
          DesignationName: data.designationName
        };


        let response;

        if (data.id && data.id !== 0) {
          payload.Id = data.id;
          response = await api.put(`designationsibling/Update`, payload);
          toast.success(response.data.message || "✅ Designation sibling updated successfully!");
        } else {
          response = await api.post(`designationsibling/Insert`, payload);
          toast.success(response.data.message || "✅ Designation sibling created successfully!");
        }

        if (onSuccess) onSuccess();
        hasShownValidationToast.current = false;
      } catch (error) {
        console.error("Designation sibling save error:", error);
        const serverMsg = error.response?.data?.message || error.response?.data?.Message;
        toast.error(serverMsg ? "❌ " + serverMsg : "🚨 Internal Server Error. Please try again.");
      }
    }
  );

  // ✅ Toast on first validation error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((errMsg) => {
        if (errMsg) toast.error(errMsg);
      });
    }
  }, [errors]);

  // ✅ Render Form
  return (
    <div className="form-section border p-4 mb-3 bg-light rounded">
      <h5>{formData.id && formData.id !== 0 ? "✏️ Edit Designation Sibling" : "➕ Add Designation Sibling"}</h5>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">

          {/* ✅ Designation Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <select
              name="designationId"
              className={`form-select ${errors.designationId ? "is-invalid" : ""}`}
              value={formData.designationId}
              onChange={handleChange}
            >
              <option value={-1}>-- Select Designation --</option>
              {designations.map((desig) => (
                <option key={desig.id} value={desig.id}>
                  {desig.name}
                </option>
              ))}
            </select>
            {errors.designationId && <div className="invalid-feedback">{errors.designationId}</div>}
          </div>

          {/* ✅ Sibling Name */}
          <div className="col-md-6">
            <label className="form-label">Sibling Name</label>
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

          {/* ✅ Is Active */}
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

        {/* ✅ Buttons */}
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