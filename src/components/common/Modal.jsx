import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getUsers } from "../../APICalls/DocumentFormAPI";
import { MultiSelect } from "primereact/multiselect";
import "../../layouts/custom.css";

//==================================================================
// 1. MODAL CONTENT COMPONENTS (Internal to this file)
//==================================================================

/**
 * Content for the 'Forward' modal.
 */
function ForwardModalContent({ onCancel, document, onConfirm }) {
  const [formData, setFormData] = useState({
    toCCUser: [],
  });
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const users = await getUsers();
      setUserOptions(users);
    };
    fetchDropdownData();
  }, []);

  const handleToCCUserChange = (e) => {
    setFormData((prev) => ({ ...prev, toCCUser: e.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.toCCUser || formData.toCCUser.length === 0) {
      toast.error("Please select at least one user to forward to.");
      return;
    }
    onConfirm(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body p-0">
        {document && (
          <div className="alert alert-info mb-3">
            <strong>Document:</strong> {document.documentName}
          </div>
        )}
        <div className="row g-3">
          <div className="col-12">
            <label>To CC User <span className="text-danger">*</span></label>
            {/* <MultiSelect
              value={formData.toCCUser}
              options={userOptions}
              onChange={handleToCCUserChange}
              optionLabel="fullName"
              optionValue="id"
              placeholder="Search and select users"
              filter display="chip" className="w-100"
              // The `multiselect-auto-height` class is a custom class to override PrimeReact's fixed height,
              // which should be defined in a global CSS file like index.css or App.css.
              //className="w-100 multiselect-auto-height" 
              appendTo="self"
              panelStyle={{ zIndex: 1051 }} // Set z-index higher than the modal backdrop (1050)
              itemTemplate={(option) => (
                <div>{option.fullName} ({option.email})</div>
              )}
            /> */}
          <MultiSelect
            value={formData.toCCUser}
              options={userOptions}
              onChange={handleToCCUserChange}
            optionLabel="fullName"
            optionValue="id"
            placeholder="Search and select users"
            filter
            display="chip"
            className="w-100 multiselect-auto-height"
            appendTo="self"
            panelStyle={{ zIndex: 1051 }}
            itemTemplate={(option) => (
                <div>{option.fullName} ({option.email})</div>
              )}
          />

          </div>
        </div>
      </div>
      <div className="modal-footer mt-3 p-0 d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">📤 Forward</button>
      </div>
    </form>
  );
}

/**
 * Content for the 'Complete' modal
 */
function CompletedModalContent({ onCancel, document, onConfirm }) {
  const [formData, setFormData] = useState({ remarks: "", file: null });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const textareaRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    const trimmedRemarks = formData.remarks.trim();
    if (!trimmedRemarks) newErrors.remarks = "📝 Completion remarks are required";
    else if (trimmedRemarks.length < 10) newErrors.remarks = "📝 Remarks must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (validateForm()) {
      onConfirm(formData);
    } else {
      toast.error(Object.values(errors)[0] || "Please fix the errors on the form.");
      textareaRef.current?.focus();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, file: file }));
    setFileName(file.name);
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFileName("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body p-0">
        {document && <div className="alert alert-info mb-3"><strong>Document:</strong> {document.documentName}</div>}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Completion Remarks <span className="text-danger">*</span></label>
            <textarea ref={textareaRef} name="remarks" className={`form-control ${isSubmitted && errors.remarks ? 'is-invalid' : ''}`} value={formData.remarks} onChange={handleChange} rows="3" placeholder="Min 10 characters" />
            {isSubmitted && errors.remarks && <div className="invalid-feedback d-block">{errors.remarks}</div>}
          </div>
          <div className="col-12">
            <label className="form-label">Upload File (Optional)</label>
            {!fileName ? (
              <>
                <input type="file" onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} />
                <label htmlFor="fileUpload" className="file-upload-label btn btn-outline-primary w-100 py-3">
                  <i className="pi pi-cloud-upload fs-3"></i><br />Click to upload
                </label>
              </>
            ) : (
              <div className="file-preview alert alert-success d-flex justify-content-between align-items-center">
                <span><i className="pi pi-file me-2"></i>{fileName}</span>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={removeFile}><i className="pi pi-times"></i></button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-footer mt-3 p-0 d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-success">✅ Mark as Completed</button>
      </div>
    </form>
  );
}

//==================================================================
// 2. GENERIC MODAL WRAPPER (Internal to this file)
//==================================================================

const sizeMap = { sm: "400px", md: "500px", lg: "600px", xl: "800px" };

function ModalWrapper({ show, onCancel, title, children, footer, size = "md" }) {
  if (!show) return null;

  const dialogStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    maxWidth: sizeMap[size] || sizeMap.md,
    width: "100%",
    margin: "20px",
  };

  const backdropStyle = {
    position: "fixed", top: 0, left: 0, height: "100vh", width: "100vw",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 1050,
  };

  const handleDialogClick = (e) => e.stopPropagation();

  return (
    <div className="modal-backdrop" style={backdropStyle} onClick={onCancel}>
      <div className="modal-dialog" style={dialogStyle} onClick={handleDialogClick}>
        <div className="modal-content p-3">
          {title && <h5 className="mb-3">{title}</h5>}
          <div className="modal-body p-0">{children}</div>
          {footer && <div className="modal-footer mt-3 p-0">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

//==================================================================
// 3. MAIN EXPORTED MODAL COMPONENT
//==================================================================

/**
 * A unified modal component for the application.
 * @param {object} props
 * @param {boolean} props.show - Whether to show the modal.
 * @param {'confirm' | 'complete' | 'forward'} props.type - The type of modal to render.
 * @param {string} props.title - The title of the modal.
 * @param {function} props.onCancel - Function to call on close/cancel.
 * @param {function} props.onConfirm - Function to call on confirm/submit.
 * @param {string} [props.message] - Message for the 'confirm' modal.
 * @param {object} [props.document] - Document data for 'complete' or 'forward' modals.
 * @param {...any} rest - Other props passed down to content components.
 */
export default function Modal(props) {
  const { type, show, onCancel, onConfirm, title, message, ...rest } = props;

  if (!show) {
    return null;
  }

  const renderContent = () => {
    switch (type) {
      case "complete":
        return <CompletedModalContent onCancel={onCancel} onConfirm={onConfirm} {...rest} />;
      case "forward":
        return <ForwardModalContent onCancel={onCancel} onConfirm={onConfirm} {...rest} />;
      case "confirm":
        return <p>{message || "Are you sure?"}</p>;
      default:
        console.error(`Modal type "${type}" is not recognized.`);
        return <p className="text-danger">Error: Invalid modal type specified.</p>;
    }
  };

  const renderFooter = () => {
    // Only the 'confirm' modal needs a generic footer, others have their own.
    if (type === "confirm") {
      return (
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      );
    }
    return null;
  };

  const getModalSize = () => {
    switch (type) {
      case "forward": return "lg";
      case "complete": return "md";
      case "confirm": return "sm";
      default: return "md";
    }
  };

  return (
    <ModalWrapper
      show={show}
      onCancel={onCancel}
      title={title}
      footer={renderFooter()}
      size={getModalSize()}
    >
      {renderContent()}
    </ModalWrapper>
  );
}
