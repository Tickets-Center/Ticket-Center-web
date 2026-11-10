import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar";
import PageLoader from "../../../components/ui/PageLoader";
import { StatusBadge } from "../../../components/ui/TicketBadges";
import { formatDateTime } from "../../../lib/format";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { managerApi } from "../../../services/api/manager";
import ChatBox from "../../chat/components/ChatBox";

export default function Progress() {
  const { id } = useParams();
  const loader = useCallback(() => managerApi.getProgress(id), [id]);
  const { data: ticket, loading, error } = useAsyncData(
    loader,
    [id],
    "Failed to load ticket progress.",
  );
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="route-container">
        {loading && <PageLoader label="Loading progress…" />}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && !ticket && <p>Ticket not found.</p>}

        {ticket && (
          <>
            <header className="progress-header">
              <div>
                <h1>{ticket.title || `Ticket #${ticket.id}`}</h1>
                <StatusBadge status={ticket.status} />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setChatOpen((current) => !current)}
              >
                {chatOpen ? "✕ Close Chat" : "💬 Open Chat"}
              </button>
            </header>

            <section className="info-card">
              <h3 className="info-card-label">Description</h3>
              <p>{ticket.description}</p>
            </section>

            {ticket.assigments?.map((assignment) => (
              <section key={assignment.id} className="info-card">
                <h3>Assignment #{assignment.id}</h3>

                {assignment.leader && (
                  <p>
                    <strong>Leader: </strong>
                    {assignment.leader.name}
                  </p>
                )}

                {assignment.technicians?.length > 0 && (
                  <div>
                    <span className="info-card-label">Technicians:</span>
                    <div className="selected-tags">
                      {assignment.technicians.map((technician) => (
                        <span key={technician.id} className="tag">
                          {technician.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}

            {ticket.interventions?.length > 0 && (
              <section>
                <h3>Interventions</h3>
                <div className="stack">
                  {ticket.interventions.map((intervention) => (
                    <article key={intervention.id} className="info-card">
                      <div className="info-card-date">
                        📅 {formatDateTime(intervention.appointment) || "No appointment set"}
                      </div>
                      <div className="info-card-muted">
                        {intervention.note || "No note yet."}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {ticket.completed_at && (
              <p className="success-text">
                ✓ Completed at: {formatDateTime(ticket.completed_at)}
              </p>
            )}
          </>
        )}
      </div>

      {chatOpen && ticket && (
        <ChatBox
          ticketId={ticket.id}
          ticketTitle={ticket.title || `Ticket #${ticket.id}`}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
