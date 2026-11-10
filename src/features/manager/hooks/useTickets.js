import { useCallback, useMemo, useState } from "react";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { managerApi } from "../../../services/api/manager";

const PAGE_SIZE = 10;

export function useTickets() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const loader = useCallback(() => managerApi.getTickets(), []);
  const { data, loading, error } = useAsyncData(
    loader,
    [],
    "Failed to load tickets.",
  );

  const filtered = useMemo(() => {
    const tickets = Array.isArray(data) ? data : [];
    return status === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === status);
  }, [data, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  return {
    loading,
    error,
    status,
    setStatus: changeStatus,
    page: currentPage,
    setPage,
    paginated,
    totalPages,
    total: filtered.length,
  };
}
