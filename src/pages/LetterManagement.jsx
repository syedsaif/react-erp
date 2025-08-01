import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AddNewLetter from "../components/letter/LetterForm";   
import ViewLetter from "../components/letter/ViewLetter";     

const LETTERS_PER_PAGE = 5;

function LetterManagement() {
  const [letters, setLetters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLetters = JSON.parse(localStorage.getItem("letters")) || [];
    setLetters(storedLetters);
  }, []);

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this letter?")) {
      const updated = letters.filter((l) => l.id !== id);
      setLetters(updated);
      localStorage.setItem("letters", JSON.stringify(updated));
      const maxPage = Math.ceil(updated.length / LETTERS_PER_PAGE) || 1;
      if (currentPage > maxPage) setCurrentPage(maxPage);
    }
  }

  const totalPages = Math.ceil(letters.length / LETTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * LETTERS_PER_PAGE;
  const currentLetters = letters.slice(startIndex, startIndex + LETTERS_PER_PAGE);

  return (
    <div>
      <h3 className="mb-4">📄 Letters Management</h3>

      {/* Show this list and buttons only when not on nested route */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <button
                className="btn btn-success mb-3"
                onClick={() => navigate("/letters/new")}
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
                  {letters.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No letters added yet.
                      </td>
                    </tr>
                  ) : (
                    currentLetters.map((letter, idx) => (
                      <tr key={letter.id}>
                        <td>{startIndex + idx + 1}</td>
                        <td>{letter.subject}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => navigate(`/letters/view/${letter.id}`)}
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
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          }
        />

        {/* Nested routes */}
        <Route path="new" element={<AddNewLetter />} />
        <Route path="view/:id" element={<ViewLetter />} />
      </Routes>
    </div>
  );
}

export default LetterManagement;
