import {
  TICKET_STATUS_FILTERS,
  getStatusMeta,
} from "../../../constants/tickets";

const labelFor = (status) =>
  status === "all" ? "All" : getStatusMeta(status).label;

export default function TicketFilters({ status, onChange }) {
  return (
    <div className="ticket-filters">
      {TICKET_STATUS_FILTERS.map((value) => (
        <button
          type="button"
          key={value}
          onClick={() => onChange(value)}
          className={`filter-chip ${status === value ? "active" : ""}`}
        >
          {labelFor(value)}
        </button>
      ))}
    </div>
  );
}
