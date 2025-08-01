import { Modal } from "react-bootstrap";

export default function UserRoleViewModal({ data, onClose }) {
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>🔍 View Association</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          <li className="list-group-item"><strong>User:</strong> {data.user}</li>
          <li className="list-group-item"><strong>Role:</strong> {data.role}</li>
        </ul>
      </Modal.Body>
    </Modal>
  );
}
