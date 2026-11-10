import { useCallback } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { ticketsApi } from "../../../services/api/tickets";

export function useMyTickets(enabled = true) {
  const loader = useCallback(
    () => (enabled ? ticketsApi.myTickets() : Promise.resolve([])),
    [enabled],
  );
  const { data, loading, error } = useAsyncData(
    loader,
    [enabled],
    "Failed to load tickets.",
  );

  return {
    tickets: Array.isArray(data) ? data : [],
    loading: enabled ? loading : false,
    error: enabled ? error : "",
  };
}
