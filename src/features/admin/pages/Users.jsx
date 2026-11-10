import { useMemo, useState } from "react";

import Navbar from "../../../components/layout/Navbar";
import PageLoader from "../../../components/ui/PageLoader";
import { ROLE_COLORS, getRoleMeta } from "../../../constants/users";
import { pluralize } from "../../../lib/format";
import "../../../styles/admin.css";
import { useAdminUsers } from "../hooks/useAdminUsers";

const FALLBACK_ROLES = Object.keys(ROLE_COLORS).filter(
  (role) => role !== "default",
);

function RoleSelect({ userId, currentRole, roles, onChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (event) => {
    const nextRole = event.target.value;
    if (nextRole === currentRole) return;

    setSaving(true);
    setError("");
    try {
      await onChange(userId, nextRole);
    } catch (err) {
      setError(err.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="role-select">
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={saving}
        className="role-select-input"
      >
        {currentRole === "default" && (
          <option value="default" disabled>
            Default
          </option>
        )}
        {roles.map((role) => (
          <option key={role} value={role}>
            {getRoleMeta(role).label}
          </option>
        ))}
      </select>
      {saving && <span className="muted-text">Saving…</span>}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

function DeleteModal({ user, onConfirm, onClose, loading, error }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Delete User</h3>
        <p>
          Are you sure you want to delete <strong>{user.name}</strong>? This
          cannot be undone.
        </p>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { users, roles, loading, error, updateRole, removeUser } =
    useAdminUsers();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const stats = useMemo(() => {
    const counts = {};
    users.forEach((user) => {
      counts[user.role] = (counts[user.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const availableRoles = roles.length ? roles : FALLBACK_ROLES;
  const filterRoles = ["default", ...availableRoles];

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await removeUser(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="route-container">
        <header className="admin-header">
          <h1>User Management</h1>
          <p>
            {users.length} total {pluralize(users.length, "user")}
          </p>
        </header>

        {users.length > 0 && (
          <div className="admin-stats">
            {Object.entries(ROLE_COLORS).map(([role, config]) => {
              const count = stats[role] || 0;
              if (!count) return null;

              return (
                <button
                  type="button"
                  key={role}
                  className={`admin-stat ${filterRole === role ? "active" : ""}`}
                  onClick={() =>
                    setFilterRole(filterRole === role ? "all" : role)
                  }
                >
                  <span className="admin-stat-count" style={{ color: config.bg }}>
                    {count}
                  </span>
                  <span className="admin-stat-label">
                    {config.label}
                    {count !== 1 ? "s" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="admin-filters">
          <input
            className="input admin-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="input admin-select"
            value={filterRole}
            onChange={(event) => setFilterRole(event.target.value)}
          >
            <option value="all">All roles</option>
            {filterRoles.map((role) => (
              <option key={role} value={role}>
                {getRoleMeta(role).label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <PageLoader label="Loading users…" />}

        {!loading && !error && filtered.length === 0 && (
          <p className="muted-center">No users match your filters.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="admin-table-wrap desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id}>
                      <td className="admin-id">#{user.id}</td>
                      <td>
                        <div className="admin-user">
                          <span className="admin-avatar">
                            {user.name[0]?.toUpperCase()}
                          </span>
                          {user.name}
                        </div>
                      </td>
                      <td className="muted-text">{user.email}</td>
                      <td>
                        <RoleSelect
                          userId={user.id}
                          currentRole={user.role}
                          roles={availableRoles}
                          onChange={updateRole}
                        />
                      </td>
                      <td>
                        <span
                          className={
                            user.verified
                              ? "admin-verified"
                              : "admin-pending"
                          }
                        >
                          {user.verified ? "✓ Verified" : "⚠ Pending"}
                        </span>
                      </td>
                      <td className="muted-text admin-date">
                        {user.created_at}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() => {
                            setDeleteError("");
                            setDeleteTarget(user);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-cards mobile-cards">
              {filtered.map((user) => (
                <article key={user.id} className="admin-card">
                  <div className="admin-card-head">
                    <div className="admin-user">
                      <span className="admin-avatar">
                        {user.name[0]?.toUpperCase()}
                      </span>
                      <div>
                        <div className="admin-card-name">{user.name}</div>
                        <div className="muted-text">{user.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-delete"
                      onClick={() => {
                        setDeleteError("");
                        setDeleteTarget(user);
                      }}
                      aria-label={`Delete ${user.name}`}
                    >
                      🗑
                    </button>
                  </div>
                  <div className="admin-card-meta">
                    <RoleSelect
                      userId={user.id}
                      currentRole={user.role}
                      roles={availableRoles}
                      onChange={updateRole}
                    />
                    <span
                      className={
                        user.verified ? "admin-verified" : "admin-pending"
                      }
                    >
                      {user.verified ? "✓ Verified" : "⚠ Pending"}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <p className="admin-count">
              Showing {filtered.length} of {users.length} users
            </p>
          </>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
          error={deleteError}
        />
      )}
    </>
  );
}
