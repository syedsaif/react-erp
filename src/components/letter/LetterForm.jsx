import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const userInfo = {
  user: "Muhammad Ali",
  department: "Information Technology",
  designation: "Project Manager",
};

const initialBodyTemplates = {
  "Appreciation Letter": `Dear [Employee Name],

I would like to take this opportunity to sincerely appreciate your exceptional dedication, hard work, and commitment towards your role as ${userInfo.designation} in the ${userInfo.department} department.

Your consistent performance and positive attitude have significantly contributed to the success of our team and organization. Your willingness to go above and beyond in all tasks assigned to you has not gone unnoticed.

We truly value your efforts and look forward to your continued contributions and growth within the company.

Thank you once again for your outstanding service.

Best regards,`,
};

export default function LetterForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedTemplateFromUrl = searchParams.get("template") || "";

  const [letterType, setLetterType] = useState(selectedTemplateFromUrl);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Show/hide form container
  const [showForm, setShowForm] = useState(Boolean(selectedTemplateFromUrl));

  useEffect(() => {
    if (letterType) {
      setShowForm(true);
      // Auto-fill appreciation letter if empty
      if (
        letterType === "Appreciation Letter" &&
        !body.trim()
      ) {
        setBody(initialBodyTemplates["Appreciation Letter"]);
      }
    } else {
      setShowForm(false);
      setBody("");
    }
  }, [letterType]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!subject.trim() || !body.trim()) {
      alert("Please fill subject and letter body.");
      return;
    }

    const timestamp = Date.now();
    const letterCode = `LET-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${timestamp.toString().slice(-4)}`;

    const newLetter = {
      id: timestamp,
      code: letterCode,
      subject: subject.trim(),
      body: body.trim(),
      department: userInfo.department,
      designation: userInfo.designation,
      user: userInfo.user,
    };

    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    letters.unshift(newLetter);
    localStorage.setItem("letters", JSON.stringify(letters));

    alert("Letter saved successfully.");
    navigate("/letters"); // redirect to list page
  }

  return (
    <div className="container mt-5">
      <h2>Generate Letter</h2>

      <div className="mb-3">
        <label htmlFor="letterType" className="form-label">
          Select Letter Type
        </label>
        <select
          id="letterType"
          className="form-select"
          value={letterType}
          onChange={(e) => setLetterType(e.target.value)}
        >
          <option value="">-- Select Letter Type --</option>
          <option value="Promotion Letter">Promotion Letter</option>
          <option value="Appreciation Letter">Appreciation Letter</option>
          <option value="Resignation Letter">Resignation Letter</option>
          <option value="Leave Application">Leave Application</option>
        </select>
      </div>

      {showForm && (
        <div
          className="template-box p-4 mb-4"
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                <strong>Subject:</strong>
              </label>
              <input
                type="text"
                id="subject"
                className="form-control"
                placeholder="Type subject here..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                <strong>Letter Body:</strong>
              </label>
              <textarea
                id="body"
                className="form-control"
                rows={10}
                placeholder="Write the letter body here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="mt-4 text-muted">
              <p>{userInfo.user}</p>
              <p>{userInfo.department}</p>
              <p>{userInfo.designation}</p>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Submit Letter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
