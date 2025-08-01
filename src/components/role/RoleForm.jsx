import React from "react";

export default function RoleForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-section border p-4 mb-3 bg-light rounded">
      <h5>{formData.editIndex === -1 ? "Add Role" : "Edit Role"}</h5>
      <form onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Role Name</label>
            <input
              type="text"
              name="roleName"
              className="form-control"
              value={formData.roleName}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6 d-flex align-items-center mt-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="isActive"
                className="form-check-input"
                id="isActive"
                checked={formData.isActive}
                onChange={onChange}
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
