export default function UserRoleTable({ associations, onView, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {associations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No associations yet</td>
            </tr>
          ) : (
            associations.map((assoc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{assoc.user}</td>
                <td>{assoc.role}</td>
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
