export default function UserForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-section border p-4 mb-3 bg-light rounded">
      <h5>{formData.editIndex === -1 ? "Add User" : "Edit User"}</h5>
      <form onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={formData.firstName}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cell No</label>
            <input
              type="text"
              name="cellNo"
              className="form-control"
              value={formData.cellNo}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={onChange}
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={onChange}
            >
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Marketing</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <select
              name="designation"
              className="form-select"
              value={formData.designation}
              onChange={onChange}
            >
              <option>Manager</option>
              <option>Team Lead</option>
              <option>Developer</option>
              <option>Intern</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={onChange}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
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
