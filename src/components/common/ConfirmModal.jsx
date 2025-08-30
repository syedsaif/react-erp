import React from "react";

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal-dialog" style={dialogStyle}>
        <div className="modal-content p-3">
          <h5>{title}</h5>
          <p>{message}</p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1050,
};

const dialogStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  maxWidth: "400px",
  width: "100%",
  padding: "20px",
};
