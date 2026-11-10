import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { managerApi } from "../../../services/api/manager";

/**
 * Loads the ticket plus the technician directory in one request batch.
 */
export function useAssignmentWorkspace(ticketId) {
  const loader = useCallback(async () => {
    const [ticket, technicians] = await Promise.all([
      managerApi.getTicket(ticketId),
      managerApi.getTechnicians(),
    ]);

    return {
      ticket,
      technicians: Array.isArray(technicians) ? technicians : [],
    };
  }, [ticketId]);

  const { data, loading, error } = useAsyncData(
    loader,
    [ticketId],
    "Failed to load the assignment data.",
  );

  return {
    ticket: data?.ticket ?? null,
    technicians: data?.technicians ?? [],
    loading,
    error,
  };
}
