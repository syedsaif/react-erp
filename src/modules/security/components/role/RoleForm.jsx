// 
import React from "react";
import useForm from "../../hooks/useForm";
import { validateField } from "../../../../utils/validation";

export default function Role({ initialData, onSubmit, onCancel }) {
  // Centralized validation using utility function
  const validate = (data) => {
    let errors = {};

    // Reuse the validateField utility for validation
    errors = {
      ...errors,
      ...validateField({
        name: "roleName",
        value: data.roleName,
        type: "text",
        label: "Role Name",
        minLength: 3,
      }),
    };

    return errors;
  };

  const {
    formData,
    errors,
    handleChange,
    handleSubmit
  } = useForm(
    {
      roleName: initialData?.roleName || "",
      isActive: initialData?.isActive ?? true,
      id: initialData?.id ?? null,
    },
    validate,
    (payload) => {
      onSubmit({
        ...payload,
        roleName: payload.roleName.trim(),
      });
    }
  );

  return (
    <div className="form-section border p-4 mb-3 bg-light rounded">
      <h5>{formData.id ? "Edit Role" : "Add Role"}</h5>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Role Name</label>
            <input
              type="text"
              name="roleName"
              className={`form-control ${errors.roleName ? "is-invalid" : ""}`}
              value={formData.roleName}
              onChange={handleChange}
            />
            {errors.roleName && (
              <div className="invalid-feedback">{errors.roleName}</div>
            )}
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

        <button type="submit" className="btn btn-primary mt-3">
          💾 Save
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-3 ms-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}