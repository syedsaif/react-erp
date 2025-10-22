import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DocumentForwardList({ show, onHide, document }) {
  const [formData, setFormData] = useState({
    fromUser: "",
    department: "",
    designation: "",
    assignee: "",
    priority: "", // ✅ New priority field
    emailAlert: false,
    notificationAlert: false,
    remarks: ""
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [assignees, setAssignees] = useState([]);
  
  // ✅ Priority options
  const priorityOptions = [
    { value: "Critical", label: "🔴 Critical" },
    { value: "High", label: "🟠 High" },
    { value: "Moderate", label: "🟡 Moderate" },
    { value: "Medium", label: "🔵 Medium" },
    { value: "Low", label: "🟢 Low" }
  ];

  // Static data for demo - replace with API calls
  useEffect(() => {
    // Mock departments data
    setDepartments([
      { id: 1, name: "IT Department" },
      { id: 2, name: "HR Department" },
      { id: 3, name: "Finance Department" },
      { id: 4, name: "Operations Department" }
    ]);

    // Mock designations data
    setDesignations([
      { id: 1, name: "Manager" },
      { id: 2, name: "Team Lead" },
      { id: 3, name: "Executive" },
      { id: 4, name: "Assistant" }
    ]);

    // Mock assignees data
    setAssignees([
      { id: 1, name: "John Doe", department: "IT", designation: "Manager" },
      { id: 2, name: "Jane Smith", department: "HR", designation: "Team Lead" },
      { id: 3, name: "Mike Johnson", department: "Finance", designation: "Executive" },
      { id: 4, name: "Sarah Wilson", department: "Operations", designation: "Assistant" }
    ]);

    // Pre-fill from user if document is provided
    if (document) {
      setFormData(prev => ({
        ...prev,
        fromUser: document.fromUser || ""
      }));
    }
  }, [document]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forward Data:", formData);
    // Add your API call here
    toast.success("Document forwarded successfully!");
    onHide();
  };

  const handleReset = () => {
    setFormData({
      fromUser: document?.fromUser || "",
      department: "",
      designation: "",
      assignee: "",
      priority: "", // ✅ Reset priority
      emailAlert: false,
      notificationAlert: false,
      remarks: ""
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>📤 Forward Document</Modal.Title>
      </Modal.Header>
      
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {document && (
            <div className="alert alert-info">
              <strong>Document:</strong> {document.documentName}
            </div>
          )}
          
          <div className="row g-3">
            {/* From User - Textbox */}
            <div className="col-md-6">
              <label className="form-label">From User <span className="text-danger">*</span></label>
              <input
                type="text"
                name="fromUser"
                className="form-control"
                value={formData.fromUser}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>

            {/* Department - Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Department <span className="text-danger">*</span></label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation - Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Designation <span className="text-danger">*</span></label>
              <select
                name="designation"
                className="form-select"
                value={formData.designation}
                onChange={handleChange}
                required
              >
                <option value="">Select Designation</option>
                {designations.map(designation => (
                  <option key={designation.id} value={designation.id}>
                    {designation.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee - Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Assignee <span className="text-danger">*</span></label>
              <select
                name="assignee"
                className="form-select"
                value={formData.assignee}
                onChange={handleChange}
                required
              >
                <option value="">Select Assignee</option>
                {assignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} - {assignee.department}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Priority - Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Priority <span className="text-danger">*</span></label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                {priorityOptions.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Alerts - Checkboxes */}
            <div className="col-md-6">
              <label className="form-label">Alerts</label>
              <div className="row">
                <div className="col-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="emailAlert"
                      className="form-check-input"
                      checked={formData.emailAlert}
                      onChange={handleChange}
                      id="emailAlert"
                    />
                    <label className="form-check-label" htmlFor="emailAlert">
                      📧 Email Alert
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="notificationAlert"
                      className="form-check-input"
                      checked={formData.notificationAlert}
                      onChange={handleChange}
                      id="notificationAlert"
                    />
                    <label className="form-check-label" htmlFor="notificationAlert">
                      🔔 Notification Alert
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks - Textarea */}
            <div className="col-12">
              <label className="form-label">Remarks</label>
              <textarea
                name="remarks"
                className="form-control"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Enter forwarding remarks or instructions"
              />
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleReset}>
            🔄 Reset
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            📤 Forward Document
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}