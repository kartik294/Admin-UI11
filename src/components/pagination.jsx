// Pagination.js
import React from "react";
import "./Pagination.css";

const Pagination = ({ totalPages, currentPage, onPageChange, onDeleteSelected }) => {
  const handlePageClick = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div className="pagination-container">
      <button className="delete-button" onClick={onDeleteSelected}>
        Delete Selected
      </button>
      <ul className="pagination-list">
        <li>
          <button onClick={() => handlePageClick(1)} disabled={currentPage === 1}>
            <i className="fa-solid fa-angles-left fa-xl"></i>
          </button>
        </li>
        <li>
          <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
        </li>
        {[...Array(totalPages)].map((_, i) => (
          <li key={i}>
            <button
              onClick={() => handlePageClick(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li>
          <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="fa-solid fa-angle-left fa-rotate-180 fa-xl"></i>
          </button>
        </li>
        <li>
          <button onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages}>
            <i className="fa-solid fa-angles-left fa-rotate-180 fa-xl"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
