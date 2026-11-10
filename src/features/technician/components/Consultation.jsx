import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { technicianApi } from "../../../services/api/technician";

export default function Consultation({ interventionId, onComplete }) {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setError("");
    setMessage("");

    if (!note.trim()) {
      setError("Please write a consultation note.");
      return;
    }

    setLoading(true);
    try {
      await technicianApi.updateIntervention(interventionId, { note });
      setMessage("Consultation updated!");
      onComplete?.(interventionId);
    } catch (err) {
      setError(err.message || "Error updating consultation.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    setError("");
    setMessage("");

    if (!note.trim()) {
      setError("Please add a note before ending the assignment.");
      return;
    }
    if (!window.confirm("End this assignment?")) return;

    setEnding(true);
    try {
      await technicianApi.completeIntervention(interventionId, {
        note,
        status: "completed",
      });
      navigate("/technician/assignments");
    } catch (err) {
      setError(err.message || "Error ending assignment.");
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="consultation-card">
      <header className="consultation-title">Add Consultation</header>
      <textarea
        className="textarea"
        placeholder="Write consultation details..."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="consultation-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleUpdate}
          disabled={loading || ending}
        >
          {loading ? "Updating..." : "Update Consultation"}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleEnd}
          disabled={ending || loading}
        >
          {ending ? "Ending..." : "End Assignment"}
        </button>
      </div>
    </div>
  );
}
