import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar";
import PageLoader from "../../../components/ui/PageLoader";
import { formatDateTime } from "../../../lib/format";
import ChatBox from "../../chat/components/ChatBox";
import Appointment from "../components/Appointment";
import Consultation from "../components/Consultation";
import { useAssignment } from "../hooks/useAssignments";

export default function Assignment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { assignment, loading, error } = useAssignment(id);
  const [showAppointment, setShowAppointment] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="route-container">
          <PageLoader label="Loading assignment…" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="route-container">
          <p className="error-message">{error}</p>
        </div>
      </>
    );
  }

  if (!assignment) {
    return (
      <>
        <Navbar />
        <div className="route-container">
          <h2>Assignment not found</h2>
        </div>
      </>
    );
  }

  const ticket = assignment.ticket;
  const interventions = ticket?.interventions || [];
  const ticketId = ticket?.id;
  const pendingIntervention = interventions.find(
    (intervention) => !intervention.note,
  );

  return (
    <>
      <Navbar />
      <div className="route-container">
        <header className="assignment-detail-header">
          <div>
            <h1>{ticket?.title || "No Title"}</h1>
            <span className="muted-text">Assignment #{assignment.id}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setChatOpen((current) => !current)}
          >
            {chatOpen ? "✕ Close Chat" : "💬 Chat"}
          </button>
        </header>

        <p className="muted-text">{ticket?.description || "No Description"}</p>

        {pendingIntervention && !showAppointment && (
          <Consultation
            interventionId={pendingIntervention.id}
            onComplete={() => setShowAppointment(true)}
          />
        )}

        {ticketId && showAppointment && (
          <Appointment
            ticketId={ticketId}
            onSuccess={() => navigate("/technician/assignments")}
          />
        )}

        {!showAppointment && !pendingIntervention && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAppointment(true)}
            style={{ alignSelf: "flex-start" }}
          >
            + Make Appointment
          </button>
        )}

        {interventions.length > 0 && (
          <section>
            <h3>Interventions</h3>
            <div className="stack">
              {interventions.map((intervention) => (
                <article key={intervention.id} className="info-card">
                  <div className="info-card-date">
                    📅{" "}
                    {formatDateTime(intervention.appointment) ||
                      "No appointment set"}
                  </div>
                  <div className="info-card-muted">
                    {intervention.note || "No note yet."}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {chatOpen && ticketId && (
        <ChatBox
          ticketId={ticketId}
          ticketTitle={ticket?.title || `Ticket #${ticketId}`}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
