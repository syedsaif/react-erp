import { Modal } from "react-bootstrap";

export default function RoleViewModal({ role, onClose }) {
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>👁️ View Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Role Name:</strong> {role.roleName}
          </li>
          <li className="list-group-item">
            <strong>Is Active:</strong> {role.isActive ? "Yes" : "No"}
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  );
}
