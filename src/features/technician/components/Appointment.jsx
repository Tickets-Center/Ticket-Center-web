import { useState } from "react";
import { technicianApi } from "../../../services/api/technician";
import { validateAppointment } from "../validations/appointment";

export default function Appointment({ ticketId, onSuccess }) {
  const [formData, setFormData] = useState({ datetime: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationErrors = validateAppointment(formData);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors.datetime);
      return;
    }

    if (!ticketId) {
      setError("Missing ticket ID.");
      return;
    }

    setLoading(true);
    try {
      await technicianApi.makeAppointment({
        ticket_id: ticketId,
        appointment: formData.datetime,
      });
      setFormData({ datetime: "" });
      onSuccess?.();
    } catch (err) {
      setError(
        err?.appointment ||
          err?.ticket_id ||
          err?.leader_id ||
          err.message ||
          "Failed to create appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="appointment-form">
        <label htmlFor="datetime">Select Date &amp; Time</label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
