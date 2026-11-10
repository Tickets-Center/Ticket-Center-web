import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { technicianApi } from "../../../services/api/technician";

export function useAssignments() {
  const loader = useCallback(() => technicianApi.getAssignments(), []);
  const { data, loading, error } = useAsyncData(
    loader,
    [],
    "Failed to load assignments.",
  );

  return {
    assignments: Array.isArray(data) ? data : [],
    loading,
    error,
  };
}

export function useAssignment(id) {
  const loader = useCallback(() => technicianApi.getAssignment(id), [id]);
  const { data, loading, error } = useAsyncData(
    loader,
    [id],
    "Failed to load the assignment.",
  );

  return { assignment: data, loading, error };
}
