import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar";
import LeaderSelect from "../components/LeaderSelect";
import TechniciansSelect from "../components/TechniciansSelect";
import SelectedTechnicians from "../components/SelectedTechnicians";

import { useTicket } from "../hooks/useTicket";
import { useTechnicians } from "../hooks/useTechnicians";
import { useHandleEdit } from "../hooks/Usehandleedit";

import { inputStyle } from "../styles";

export default function EditAssignment() {
  const { id } = useParams(); // ticket id

  const { ticket, loading: ticketLoading } = useTicket(id);
  const { technicians, loading: techLoading } = useTechnicians();
  const { handleEdit, loading, error } = useHandleEdit(id);

  const [leader, setLeader] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (!ticket) return;

    setTitle(ticket.title || "");
    setPriority(ticket.priority || "");

    // API returns "assigments" (array) — grab the first entry
    const assignment = ticket.assigments?.[0];
    if (!assignment) return;

    // Leader comes as a full object — no need to look it up in technicians list
    if (assignment.leader) {
      setLeader(assignment.leader);
    }

    // Restore technicians, excluding the leader (they share the pivot table)
    if (assignment.technicians?.length) {
      const techs = assignment.technicians.filter(
        (t) => t.id !== assignment.leader_id,
      );
      setSelectedTechs(techs);
    }
  }, [ticket]);

  // When leader changes, remove them from selectedTechs if present
  const handleLeaderChange = (newLeader) => {
    setLeader(newLeader);
    if (newLeader) {
      setSelectedTechs((prev) => prev.filter((t) => t.id !== newLeader.id));
    }
  };

  const removeTechnician = (techId) => {
    setSelectedTechs((prev) => prev.filter((t) => t.id !== techId));
  };

  if (ticketLoading || techLoading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="route-container">
        <div style={{ maxWidth: 420 }}>
          <h2 style={{ marginTop: 20 }}>Edit Assignment</h2>

          <h3 style={{ marginTop: 20 }}>Reported by</h3>
          <div style={{ ...inputStyle, minHeight: 100 }}>
            {ticket?.reporter.name} ({ticket?.reporter.email})
          </div>

          <h3 style={{ marginTop: 20 }}>Description of the issue</h3>
          <div style={{ ...inputStyle, minHeight: 100 }}>
            {ticket?.description}
          </div>

          <hr />

          <h3>Title</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title..."
            style={inputStyle}
          />

          <h3 style={{ marginTop: 20 }}>Priority</h3>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <LeaderSelect
            technicians={technicians}
            leader={leader}
            setLeader={handleLeaderChange}
            removeTechnicianFromList={removeTechnician}
          />

          <TechniciansSelect
            technicians={technicians}
            leader={leader}
            selectedTechs={selectedTechs}
            setSelectedTechs={setSelectedTechs}
          />

          <SelectedTechnicians
            technicians={selectedTechs}
            removeTechnician={removeTechnician}
          />

          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

          <button
            onClick={() =>
              handleEdit({ title, priority, leader, selectedTechs })
            }
            disabled={loading}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              backgroundColor: "#068FFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
