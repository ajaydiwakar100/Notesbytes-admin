const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul className="pagination justify-content-end" style={{ marginRight: "20px" }}>
      {/* Previous button */}
      <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="page-link"
          aria-label="Previous"
        >
          Previous
        </button>
      </li>

      {/* Page numbers */}
      {pageNumbers.map((number) => (
        <li
          key={number}
          className={`page-item${currentPage === number ? " active" : ""}`}
        >
          <button onClick={() => onPageChange(number)} className="page-link">
            {number}
          </button>
        </li>
      ))}

      {/* Next button */}
      <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="page-link"
          aria-label="Next"
        >
          Next
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
