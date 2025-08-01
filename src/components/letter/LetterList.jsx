import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LETTERS_PER_PAGE = 5;

export default function LetterList() {
  const navigate = useNavigate();

  const [letters, setLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedLetters = JSON.parse(localStorage.getItem("letters")) || [];
    setLetters(savedLetters);
  }, []);

  function saveLetters(updatedLetters) {
    localStorage.setItem("letters", JSON.stringify(updatedLetters));
    setLetters(updatedLetters);
  }

  const totalPages = Math.ceil(letters.length / LETTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * LETTERS_PER_PAGE;
  const paginatedLetters = letters.slice(startIndex, startIndex + LETTERS_PER_PAGE);

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this letter?")) {
      const updatedLetters = letters.filter((letter) => letter.id !== id);
      saveLetters(updatedLetters);

      // Adjust current page if needed
      const newTotalPages = Math.ceil(updatedLetters.length / LETTERS_PER_PAGE) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    }
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📄 Letters Management</h3>

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/letter/new")}
      >
        ➕ Add New Letter
      </button>

      <table className="table table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLetters.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No letters added yet.
              </td>
            </tr>
          ) : (
            paginatedLetters.map((letter, idx) => (
              <tr key={letter.id}>
                <td>{startIndex + idx + 1}</td>
                <td>{letter.subject}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/letter/view/${letter.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(letter.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
