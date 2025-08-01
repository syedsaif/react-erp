import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";

export default function ViewLetter() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [qrCanvas, setQrCanvas] = useState(null);
  const letterContentRef = useRef();

  useEffect(() => {
    const letters = JSON.parse(localStorage.getItem("letters")) || [];
    const foundLetter = letters.find((l) => l.id.toString() === id);
    setLetter(foundLetter);

    if (foundLetter) {
      const qrData = `Letter Code: ${foundLetter.code}\nSubject: ${foundLetter.subject}`;
      QRCode.toCanvas(document.createElement("canvas"), qrData).then(
        (canvas) => {
          setQrCanvas(canvas);
        }
      );
    }
  }, [id]);

  const downloadPDF = () => {
    if (!letterContentRef.current) return;
    const opt = {
      margin: 0.5,
      filename: "Letter.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(letterContentRef.current).set(opt).save();
  };

  if (!letter) {
    return (
      <div className="container mt-5">
        <h3 className="text-danger">Letter not found!</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5" ref={letterContentRef} id="printArea">
      <div
        className="letter-box"
        /*
        style={{
          border: "1px solid #ccc",
          padding: "30px",
          borderRadius: "8px",
          background: "#fff",
          maxWidth: "700px",
          margin: "auto",
        }}
          */
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">📄 Official Letter</h4>
          <div className="no-print">
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={() => window.print()}
            >
              🖨️ Print Letter
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={downloadPDF}
            >
              ⬇️ Download PDF
            </button>
          </div>
        </div>

        {/* Letter Code + QR Code on one line */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-2">
            <strong>Letter Code:</strong> {letter.code}
          </p>
          <div id="qrCode" style={{ height: 50, width: 50, margin: 90 }}>
            {qrCanvas && <canvas ref={(el) => el && el.replaceWith(qrCanvas)} />}
            {/* Above line ensures qrCanvas is shown */}
          </div>
        </div>

        {/* Subject on a new line */}
        <p className="mb-2">
          <strong>Subject:</strong> {letter.subject}
        </p>

        <hr />

        <p style={{ whiteSpace: "pre-wrap" }}>{letter.body}</p>

        <hr />

        <div
          className="user-info"
          style={{ marginTop: "20px", fontWeight: 500, color: "#2c3e50", textAlign: "left", lineHeight: 1.6 }}
        >
          <p>{letter.user}</p>
          <p>{letter.department}</p>
          <p>{letter.designation}</p>
        </div>
      </div>
    </div>
  );
}
