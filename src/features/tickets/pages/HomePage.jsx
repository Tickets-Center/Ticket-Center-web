import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { PriorityTag, StatusBadge } from "../../../components/ui/TicketBadges";
import ChatBox from "../../chat/components/ChatBox";
import { useAuth } from "../../auth/useAuth";
import { useMyTickets } from "../hooks/useMyTickets";
import { pluralize } from "../../../lib/format";

export default function HomePage() {
  const { user } = useAuth();
  const { tickets, loading, error } = useMyTickets();
  const [activeChat, setActiveChat] = useState(null);

  const openChat = (ticket) =>
    setActiveChat({
      ticketId: ticket.id,
      ticketTitle: ticket.title || `Ticket #${ticket.id}`,
    });

  return (
    <>
      <Navbar />
      <div className="route-container">
        <div className="home-banner">
          <div>
            <h2>Welcome back{user?.name ? `, ${user.name}` : ""}! 👋</h2>
            <p>
              {tickets.length === 0 && !loading
                ? "No active tickets — all clear! 🎉"
                : `${tickets.length} active ${pluralize(tickets.length, "ticket")}`}
            </p>
          </div>
          <Link to="/createTicket" className="home-banner-action">
            + New Ticket
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading && <p className="muted-center">Loading…</p>}

        {!loading && tickets.length > 0 && (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onChat={openChat} />
            ))}
          </div>
        )}
      </div>

      {activeChat && (
        <ChatBox
          ticketId={activeChat.ticketId}
          ticketTitle={activeChat.ticketTitle}
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
}

function TicketCard({ ticket, onChat }) {
  return (
    <article className="ticket-card">
      <div className="ticket-card-main">
        <div className="ticket-card-meta">
          <span className="ticket-card-id">#{ticket.id}</span>
          <StatusBadge status={ticket.status} />
          <PriorityTag priority={ticket.priority} />
        </div>
        <h3 className="ticket-card-title">{ticket.title || "(No title)"}</h3>
        <p className="ticket-card-description">{ticket.description}</p>
      </div>

      <button className="btn btn-primary" onClick={() => onChat(ticket)}>
        💬 Chat
      </button>
    </article>
  );
}
