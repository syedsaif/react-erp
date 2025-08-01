export default function RoleTable({ roles, onView, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Role Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No roles found</td>
            </tr>
          ) : (
            roles.map((role, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{role.roleName}</td>
                <td>{role.isActive ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-info btn-sm me-1" onClick={() => onView(index)}>View</button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => onEdit(index)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
