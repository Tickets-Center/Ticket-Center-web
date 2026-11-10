import { pluralize } from "../../../lib/format";

export default function TicketPagination({ page, totalPages, total, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (number) => (
          <button
            type="button"
            key={number}
            className={`pagination-btn ${number === page ? "active" : ""}`}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        ),
      )}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next →
      </button>

      <span className="pagination-total">
        {total} {pluralize(total, "ticket")}
      </span>
    </div>
  );
}
