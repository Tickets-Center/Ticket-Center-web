import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../../components/ui/TicketBadges";

export default function TicketTable({ tickets }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Task</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={4} className="table-empty">
                No tickets found.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.description}</td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>
                  <div className="table-actions">
                    {ticket.status === "open" ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                        onClick={() => navigate(`/assign/${ticket.id}`)}
                      >
                        Assign
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-small"
                          onClick={() => navigate(`/progress/${ticket.id}`)}
                        >
                          Watch Progress
                        </button>
                        {ticket.status !== "resolved" && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={() =>
                              navigate(`/assign/edit/${ticket.id}`)
                            }
                          >
                            Edit
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
