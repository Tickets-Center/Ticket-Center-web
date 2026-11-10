import Navbar from "../../../components/layout/Navbar";
import PageLoader from "../../../components/ui/PageLoader";
import "../../../styles/table.css";
import TicketFilters from "../components/TicketFilters";
import TicketPagination from "../components/TicketPagination";
import TicketTable from "../components/TicketTable";
import { useTickets } from "../hooks/useTickets";

export default function Tickets() {
  const {
    loading,
    error,
    status,
    setStatus,
    page,
    setPage,
    paginated,
    totalPages,
    total,
  } = useTickets();

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1 className="page-title">Manage Tickets</h1>

        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <PageLoader label="Loading tickets…" />
        ) : (
          <>
            <TicketFilters status={status} onChange={setStatus} />
            <TicketTable tickets={paginated} />
            <TicketPagination
              page={page}
              totalPages={totalPages}
              total={total}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}
