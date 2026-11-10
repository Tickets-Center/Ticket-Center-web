import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar";
import PageLoader from "../../../components/ui/PageLoader";
import { PriorityBadge } from "../../../components/ui/TicketBadges";
import { TICKET_PRIORITY_ORDER } from "../../../constants/tickets";
import { formatDateTime } from "../../../lib/format";
import "../../../styles/widget.css";
import { useAssignments } from "../hooks/useAssignments";

export default function Assignments() {
  const navigate = useNavigate();
  const { assignments, loading, error } = useAssignments();

  const activeAssignments = useMemo(
    () =>
      assignments
        .filter((assignment) =>
          ["assigned", "in_progress"].includes(assignment.ticket?.status),
        )
        .sort(
          (a, b) =>
            (TICKET_PRIORITY_ORDER[a.ticket?.priority] ?? 99) -
            (TICKET_PRIORITY_ORDER[b.ticket?.priority] ?? 99),
        ),
    [assignments],
  );

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1 className="page-title">Your Assignments</h1>

        {error && <p className="error-message">{error}</p>}
        {loading && <PageLoader label="Loading assignments…" />}

        {!loading && !error && activeAssignments.length === 0 && (
          <p className="muted-center">No active assignments</p>
        )}

        {!loading && activeAssignments.length > 0 && (
          <div className="grid">
            {activeAssignments.map((assignment) => {
              const intervention = assignment.ticket?.interventions?.[0];

              return (
                <article key={assignment.id} className="widget">
                  <div className="widget-header">
                    <h2>#{assignment.id}</h2>
                    <PriorityBadge priority={assignment.ticket?.priority} />
                  </div>

                  <p>{assignment.ticket?.title || "No title"}</p>

                  {intervention ? (
                    <div className="widget-details">
                      <p>
                        Appointment:{" "}
                        {formatDateTime(intervention.appointment) || "Not set"}
                      </p>
                      <p>Note: {intervention.note || "No note yet"}</p>
                    </div>
                  ) : (
                    <p>No intervention yet</p>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary btn-small widget-action"
                    onClick={() =>
                      navigate(`/technician/assignment/${assignment.id}`)
                    }
                  >
                    {intervention ? "Add Note" : "Set Appointment / Note"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
