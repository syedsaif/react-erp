import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function CompletedModal({ 
  show, 
  onCancel, 
  document,
  onConfirm 
}) {
  const [formData, setFormData] = useState({
    remarks: "",
    file: null
  });
  
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // ✅ Track form submission
  const hasShownValidationToast = useRef(false);
  const textareaRef = useRef(null); // ✅ Ref for textarea

  // Pre-fill data if document is provided
  useEffect(() => {
    if (document) {
      setFormData(prev => ({
        ...prev,
        remarks: document.remarks || ""
      }));
    }
  }, [document]);

  const shownErrors = React.useRef(new Set());
   
   React.useEffect(() => {
     // Loop through all current errors
     Object.entries(errors).forEach(([field, message]) => {
       if (message && !shownErrors.current.has(field)) {
         toast.error(message);
         shownErrors.current.add(field); // mark this field as shown
       }
     });
   
     // Reset when no errors left
     if (Object.keys(errors).length === 0) {
       shownErrors.current.clear();
     }
   }, [errors]);

  // ✅ Reset validation when modal opens/closes
  useEffect(() => {
    if (show) {
      setErrors({});
      setIsSubmitted(false);
      hasShownValidationToast.current = false;
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ✅ Clear error when user starts typing (only if form was submitted)
    if (isSubmitted && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ✅ File size validation (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        if (isSubmitted) {
          toast.error("❌ File size should be less than 10MB");
        }
        setErrors(prev => ({ ...prev, file: "❌ File size should be less than 10MB" }));
        return;
      }

      // ✅ File type validation
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        if (isSubmitted) {
          toast.error("❌ Please upload PDF, DOC, Excel, or Image files only");
        }
        setErrors(prev => ({ ...prev, file: "❌ Please upload PDF, DOC, Excel, or Image files only" }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }));
      setFileName(file.name);
      
      // ✅ Clear file error if any
      if (errors.file) {
        setErrors(prev => ({
          ...prev,
          file: ""
        }));
      }
    }
  };

  // ✅ Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Remarks validation
    const trimmedRemarks = formData.remarks.trim();
    
    if (!trimmedRemarks) {
      newErrors.remarks = "📝 Completion remarks are required";
    } else if (trimmedRemarks.length < 10) {
      newErrors.remarks = "📝 Remarks should be at least 10 characters long";
    } else if (trimmedRemarks.length > 500) {
      newErrors.remarks = "📝 Remarks should not exceed 500 characters";
    }

    // File validation (optional)
    if (formData.file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (formData.file.size > maxSize) {
        newErrors.file = "❌ File size should be less than 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // ✅ Prevent HTML5 validation
    
    // ✅ Mark form as submitted
    setIsSubmitted(true);
    
    // ✅ Reset toast flag
    hasShownValidationToast.current = false;
    
    if (validateForm()) {
      console.log("Completion Data:", formData);
      if (onConfirm) {
        onConfirm(formData);
      }
      // Reset form
      handleReset();
    } else {
      // ✅ Focus on first error field
      if (errors.remarks && textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleReset = () => {
    setFormData({
      remarks: "",
      file: null
    });
    setFileName("");
    setErrors({});
    setIsSubmitted(false);
    hasShownValidationToast.current = false;
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setFileName("");
    
    // ✅ Clear file error
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ""
      }));
    }
  };

  // ✅ Handle spacebar and other key presses to prevent HTML5 validation
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" style={backdropStyle}>
      <div className="modal-dialog" style={dialogStyle}>
        <div className="modal-content p-4">
          <h5 className="mb-3">✅ Mark as Completed</h5>
          
          {/* ✅ Remove novalidate from form to disable HTML5 validation */}
          <form onSubmit={handleSubmit} noValidate> 
            <div className="modal-body">
              {document && (
                <div className="alert alert-info mb-3">
                  <strong>Document:</strong> {document.documentName}
                  <br />
                  <strong>Code:</strong> {document.code}
                </div>
              )}
              
              <div className="row g-3">
                {/* Remarks - Textarea with Validation */}
                <div className="col-12">
                  <label className="form-label">Completion Remarks <span className="text-danger">*</span></label>
                  <textarea
                    ref={textareaRef}
                    name="remarks"
                    className={`form-control ${isSubmitted && errors.remarks ? 'is-invalid' : ''}`}
                    value={formData.remarks}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    rows="3"
                    placeholder="Enter completion remarks or notes (minimum 10 characters)"
                    // ✅ Remove required attribute to prevent HTML5 validation
                  />
                  {isSubmitted && errors.remarks && (
                    <div className="invalid-feedback d-block">
                      {errors.remarks}
                    </div>
                  )}
                  <div className="form-text">
                    Character count: {formData.remarks.length}/500
                    {formData.remarks.trim().length < 10 && isSubmitted && (
                      <span className="text-danger"> - Minimum 10 characters required</span>
                    )}
                  </div>
                </div>

                {/* File Upload with Validation */}
                <div className="col-12">
                  <label className="form-label">Upload Completed File</label>
                  
                  {!fileName ? (
                    <div className="file-upload-area">
                      <input
                        type="file"
                        className={`form-control ${isSubmitted && errors.file ? 'is-invalid' : ''}`}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        id="fileUpload"
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="fileUpload" 
                        className="file-upload-label btn btn-outline-primary w-100 py-3"
                        style={{ 
                          cursor: 'pointer', 
                          border: '2px dashed #007bff',
                          borderColor: (isSubmitted && errors.file) ? '#dc3545' : '#007bff'
                        }}
                      >
                        <div className="text-center">
                          <i className="pi pi-cloud-upload" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                          <br />
                          📁 Click to upload file
                          <br />
                          <small className="text-muted">PDF, DOC, Excel, Images (Max: 10MB)</small>
                        </div>
                      </label>
                      {isSubmitted && errors.file && (
                        <div className="invalid-feedback d-block">
                          {errors.file}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="file-preview alert alert-success d-flex justify-content-between align-items-center">
                      <div>
                        <i className="pi pi-file me-2"></i>
                        <strong>{fileName}</strong>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeFile}
                      >
                        <i className="pi pi-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer mt-3">
              <button type="button" className="btn btn-secondary me-2" onClick={handleReset}>
                🔄 Reset
              </button>
              <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                ✅ Mark as Completed
              </button>
            </div>
          </form>
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
  maxWidth: "500px",
  width: "100%",
  margin: "20px",
};