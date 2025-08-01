import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function UserViewModal({ user, onClose }) {
  return (
    <Modal show={!!user} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>👁️ View User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <ul className="list-group">
            <li className="list-group-item"><strong>Full Name:</strong> {user.firstName} {user.lastName}</li>
            <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
            <li className="list-group-item"><strong>Cell No:</strong> {user.cellNo}</li>
            <li className="list-group-item"><strong>Gender:</strong> {user.gender}</li>
            <li className="list-group-item"><strong>Department:</strong> {user.department}</li>
            <li className="list-group-item"><strong>Designation:</strong> {user.designation}</li>
            <li className="list-group-item"><strong>Role:</strong> {user.role}</li>
          </ul>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
