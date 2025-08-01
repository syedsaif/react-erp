export default function UserRoleForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-section border p-4 mb-3 bg-light rounded">
      <h5>{formData.editIndex === -1 ? "Add Association" : "Edit Association"}</h5>
      <form onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">User</label>
            <select
              name="user"
              className="form-select"
              value={formData.user}
              onChange={onChange}
              required
            >
              <option value="">Select User</option>
              <option>Ali Raza</option>
              <option>Sana Tariq</option>
              <option>Umar Khan</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={onChange}
              required
            >
              <option value="">Select Role</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          💾 Save
        </button>
        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
