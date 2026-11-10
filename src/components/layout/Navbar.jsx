import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSun,
  faMoon,
  faHouse,
  faUserGear,
  faClipboardList,
  faChartLine,
  faBell,
  faEnvelope,
  faRightFromBracket,
  faGear,
  faCheck,
  faBars,
  faBell,
  faCheck,
  faCircle,
  faClipboardList,
  faEnvelope,
  faHouse,
  faMoon,
  faRightFromBracket,
  faSun,
  faTicket,
  faTimes,
  faUserGear,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

import "../../styles/navbar.css";
import { getStatusMeta } from "../../constants/tickets";
import { formatTime } from "../../lib/format";
import { useAuth } from "../../features/auth/useAuth";
import { getUserRoles, useHasRole } from "../../features/auth/useHasRole";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { useMyTickets } from "../../features/tickets/hooks/useMyTickets";
import { useNotifications } from "../../hooks/useNotifications";
import { useTheme } from "../../hooks/useTheme";
import ChatBox from "../../features/chat/components/ChatBox";
import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";

const NOTIFICATION_ICONS = {
  assignment: "📋",
  resolved: "✅",
  message: "💬",
  info: "ℹ️",
};

const NAV_LINKS = [
  { to: "/", icon: faHouse, label: "Home" },
  {
    to: "/technician/assignments",
    icon: faClipboardList,
    label: "Assignments",
    assignmentOnly: true,
  },
  {
    to: "/manager/tickets",
    icon: faUserGear,
    label: "Tickets",
    managerOnly: true,
  },
  { to: "/createTicket", icon: faTicket, label: "New Ticket" },
  { to: "/admin/users", icon: faUsersGear, label: "Users", adminOnly: true },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { logout, loading: logoutLoading } = useLogout();
  const { user } = useAuth();
  const { tickets } = useMyTickets(Boolean(user));
  const location = useLocation();

  const canManageTickets = useHasRole(["dispatcher", "admin"]);
  const canUseAssignments = useHasRole(["admin", "technician"]);
  const isAdmin = useHasRole(["admin"]);

  const {
    notifications,
    unreadCount,
    unreadMessages,
    markAllRead,
    markRead,
    clearAll,
  } = useNotifications();

  const [activeChat, setActiveChat] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openChat = (ticket) => {
    setActiveChat({
      ticketId: ticket.id,
      ticketTitle: ticket.title || `Ticket #${ticket.id}`,
    });
  };

  const isVisible = ({ managerOnly, adminOnly, assignmentOnly }) => {
    if (managerOnly && !canManageTickets) return false;
    if (adminOnly && !isAdmin) return false;
    if (assignmentOnly && !canUseAssignments) return false;
    return true;
  };

  const visibleLinks = NAV_LINKS.filter(isVisible);
  const roleLabel = getUserRoles(user)[0];
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fb-navbar">
        <div className="nav-left">
          <Link to="/" className="logo" aria-label="Ticket Center home">
            TC
          </Link>
        </div>

        <div className="nav-center nav-center-desktop">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-icon ${isActive(link.to) ? "nav-icon-active" : ""}`}
              title={link.label}
            >
              <FontAwesomeIcon icon={link.icon} />
            </Link>
          ))}
        </div>

        <div className="nav-right">
          {/* MESSAGES */}
          <Dropdown>
            {({ open, toggle }) => (
              <>
                <button
                  type="button"
                  className="nav-icon badge-wrapper"
                  onClick={toggle}
                  aria-label="Open ticket messages"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  {unreadMessages.length > 0 && (
                    <span className="badge">
                      {unreadMessages.length > 9
                        ? "9+"
                        : unreadMessages.length}
                    </span>
                  )}
                </button>

                {open && (
                  <div className="dropdown-panel">
                    <div className="panel-header">
                      <span>Messages</span>
                      <span className="panel-count">
                        {tickets.length} active
                      </span>
                    </div>
                    <div className="panel-list">
                      {tickets.length === 0 ? (
                        <div className="panel-empty">No active tickets</div>
                      ) : (
                        tickets.map((ticket) => {
                          const meta = getStatusMeta(ticket.status);
                          return (
                            <button
                              type="button"
                              key={ticket.id}
                              className="panel-item panel-button"
                              onClick={() => openChat(ticket)}
                            >
                              <div className="panel-item-main">
                                <div className="panel-item-title">
                                  {ticket.title || `Ticket #${ticket.id}`}
                                </div>
                                <div className="panel-item-subtitle">
                                  #{ticket.id}
                                </div>
                              </div>
                              <span
                                className="panel-item-status"
                                style={{ color: meta.color }}
                              >
                                {meta.label}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Dropdown>

          {/* NOTIFICATIONS */}
          <Dropdown>
            {({ open, toggle }) => (
              <>
                <button
                  type="button"
                  className="nav-icon badge-wrapper"
                  onClick={toggle}
                  aria-label="Open notifications"
                >
                  <FontAwesomeIcon icon={faBell} />
                  {unreadCount > 0 && (
                    <span className="badge">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {open && (
                  <div className="dropdown-panel">
                    <div className="panel-header">
                      <span>Notifications</span>
                      <div className="panel-actions">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllRead}
                            title="Mark all read"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAll}
                            className="danger-icon"
                            title="Clear all"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="panel-list">
                      {notifications.length === 0 ? (
                        <div className="panel-empty">No notifications yet</div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            type="button"
                            key={notification.id}
                            className={`panel-item panel-button ${notification.unread ? "unread" : ""}`}
                            onClick={() => {
                              markRead(notification.id);
                              if (notification.meta?.ticketId) {
                                openChat({
                                  id: notification.meta.ticketId,
                                  title: notification.meta.ticketTitle,
                                });
                              }
                            }}
                          >
                            <span className="panel-item-icon">
                              {NOTIFICATION_ICONS[notification.type] || "🔔"}
                            </span>
                            <div className="panel-item-main">
                              <div className="panel-item-text">
                                {notification.text}
                              </div>
                              {notification.time && (
                                <div className="panel-item-subtitle">
                                  {formatTime(notification.time)}
                                </div>
                              )}
                            </div>
                            {notification.unread && (
                              <FontAwesomeIcon
                                icon={faCircle}
                                className="unread-dot"
                              />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Dropdown>

          {/* PROFILE */}
          <Dropdown>
            {({ open, toggle, close }) => (
              <>
                <button
                  type="button"
                  className="avatar-trigger"
                  onClick={toggle}
                  aria-label="Open profile menu"
                >
                  <Avatar name={user?.name} />
                </button>

                {open && (
                  <div className="profile-dropdown">
                    {user && (
                      <div className="profile-summary">
                        <div className="profile-name">{user.name}</div>
                        <div className="profile-email">{user.email}</div>
                        {roleLabel && (
                          <div className="profile-role">{roleLabel}</div>
                        )}
                      </div>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        className="dropdown-item"
                        onClick={close}
                      >
                        <FontAwesomeIcon icon={faUsersGear} /> User Management
                      </Link>
                    )}

                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        toggleTheme();
                        close();
                      }}
                    >
                      <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
                      {isDark ? " Dark Mode" : " Light Mode"}
                    </button>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-item danger"
                      onClick={() => {
                        logout();
                        close();
                      }}
                      disabled={logoutLoading}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      {logoutLoading ? "Logging out…" : "Logout"}
                    </button>
                  </div>
                )}
              </>
            )}
          </Dropdown>

          <button
            type="button"
            className="hamburger"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-drawer" onClick={() => setMobileOpen(false)}>
          <div
            className="mobile-drawer-inner"
            onClick={(event) => event.stopPropagation()}
          >
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-nav-link ${isActive(link.to) ? "nav-icon-active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <FontAwesomeIcon icon={link.icon} />
                <span>{link.label}</span>
              </Link>
            ))}
            <hr />
            <button
              type="button"
              className="mobile-nav-link danger"
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              disabled={logoutLoading}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>{logoutLoading ? "Logging out…" : "Logout"}</span>
            </button>
          </div>
        </div>
      )}

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
