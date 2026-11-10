import { useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar";
import PageLoader from "../../../components/ui/PageLoader";
import { TICKET_PRIORITY_OPTIONS } from "../../../constants/tickets";
import AssignmentPeopleFields from "../components/AssignmentPeopleFields";
import { useAssignmentWorkspace } from "../hooks/useAssignmentWorkspace";
import { useSaveAssignment } from "../hooks/useSaveAssignment";

/**
 * One page for both assignment routes:
 *   /assign/:id       -> mode="create"
 *   /assign/edit/:id  -> mode="edit"
 */
export default function AssignmentForm({ mode = "create" }) {
  const { id } = useParams();
  const { ticket, technicians, loading, error } = useAssignmentWorkspace(id);

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

  if (!ticket) {
    return (
      <>
        <Navbar />
        <div className="route-container">
          <p>Ticket not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="route-container">
        <AssignmentEditor
          key={ticket.id}
          mode={mode}
          ticket={ticket}
          technicians={technicians}
        />
      </div>
    </>
  );
}

function AssignmentEditor({ mode, ticket, technicians }) {
  const assignment = mode === "edit" ? ticket.assigments?.[0] : null;

  const [title, setTitle] = useState(ticket.title || "");
  const [priority, setPriority] = useState(ticket.priority || "");
  const [leader, setLeader] = useState(assignment?.leader ?? null);
  const [selectedTechnicians, setSelectedTechnicians] = useState(
    () =>
      assignment?.technicians?.filter(
        (technician) => technician.id !== assignment.leader_id,
      ) ?? [],
  );

  const { save, saving, error } = useSaveAssignment(ticket.id, mode);

  return (
    <div className="assignment-page">
      <h2>{mode === "edit" ? "Edit Assignment" : "Assign Ticket"}</h2>

      <h3>Reported by</h3>
      <div className="readonly-field">
        {ticket.reporter?.name} ({ticket.reporter?.email})
      </div>

      <h3>Description of the issue</h3>
      <div className="readonly-field">{ticket.description}</div>

      <hr />

      <h3>Title</h3>
      <input
        className="input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ticket title..."
      />

      <h3>Priority</h3>
      <select
        className="input"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="">Select priority</option>
        {TICKET_PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <AssignmentPeopleFields
        technicians={technicians}
        leader={leader}
        selectedTechnicians={selectedTechnicians}
        onLeaderChange={setLeader}
        onTechniciansChange={setSelectedTechnicians}
      />

      {error && <p className="error-message">{error}</p>}

      <button
        type="button"
        className="btn btn-primary assignment-submit"
        onClick={() =>
          save({ title, priority, leader, selectedTechnicians })
        }
        disabled={saving}
      >
        {mode === "edit"
          ? saving
            ? "Saving..."
            : "Save Changes"
          : saving
            ? "Submitting..."
            : "Assign Ticket"}
      </button>
    </div>
  );
}
