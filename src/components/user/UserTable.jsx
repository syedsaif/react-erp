import React from "react";

export default function UserTable({ users, onView, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Cell No</th>
            <th>Gender</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No users available
              </td>
            </tr>
          )}
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.cellNo}</td>
              <td>{user.gender}</td>
              <td>{user.department}</td>
              <td>{user.designation}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-info btn-sm me-1" onClick={() => onView(index)}>View</button>
                <button className="btn btn-warning btn-sm me-1" onClick={() => onEdit(index)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}