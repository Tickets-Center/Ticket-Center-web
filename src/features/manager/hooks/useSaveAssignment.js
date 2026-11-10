import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { managerApi } from "../../../services/api/manager";
import { validateAssignment } from "../validations/assignment";

/**
 * Shared submit behaviour for creating and editing an assignment.
 */
export function useSaveAssignment(ticketId, mode) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async ({ title, priority, leader, selectedTechnicians }) => {
    setError("");

    const validationError = validateAssignment({ title, priority, leader });
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      title,
      priority,
      leader_id: leader.id,
      // The leader shares the pivot table; never submit them twice.
      technician_ids: selectedTechnicians
        .filter((technician) => technician.id !== leader.id)
        .map((technician) => technician.id),
    };

    setSaving(true);
    try {
      if (mode === "edit") {
        await managerApi.updateAssignment(ticketId, payload);
      } else {
        await managerApi.createAssignment(ticketId, payload);
      }
      navigate("/manager/tickets");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return { save, saving, error };
}
