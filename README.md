# Ticket Center Web

React + Vite front-end for the Ticket Center support desk. Users raise
tickets, managers assign them to technicians, technicians record consultations
and appointments, and admins manage accounts and roles. Ticket chat and
notifications are delivered in real time over Laravel Reverb.

## Architecture

The codebase is organised by responsibility instead of by page:

```
src/
├─ config/                 # Runtime configuration (API URL, Reverb)
│  └─ env.js
├─ constants/              # Shared domain metadata
│  ├─ tickets.js           # Statuses, priorities, labels, colours, ordering
│  └─ users.js             # Roles, labels, colours
├─ lib/                    # Framework-agnostic helpers
│  ├─ apiError.js          # API error normalisation
│  ├─ format.js            # Date/time, initials, pluralisation
│  └─ session.js           # Token/roles/permissions persistence
├─ services/
│  ├─ api/
│  │  ├─ client.js         # Axios instance + token/401/403 interceptors
│  │  ├─ auth.js
│  │  ├─ tickets.js
│  │  ├─ manager.js
│  │  ├─ technician.js
│  │  ├─ admin.js
│  │  ├─ chat.js
│  │  └─ notifications.js
│  └─ socket/
│     └─ echo.js           # Reverb/Echo singleton
├─ hooks/                  # Cross-feature hooks
│  ├─ useAsyncData.js
│  ├─ useNotifications.js
│  └─ useTheme.js
├─ components/
│  ├─ layout/
│  │  └─ Navbar.jsx
│  └─ ui/
│     ├─ Avatar.jsx
│     ├─ Dropdown.jsx
│     ├─ PageLoader.jsx
│     ├─ StatusPage.jsx
│     └─ TicketBadges.jsx
├─ features/
│  ├─ auth/
│  │  ├─ AuthProvider.jsx
│  │  ├─ authContext.js
│  │  ├─ useAuth.js
│  │  ├─ useHasRole.js
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ validation.js
│  │  ├─ auth.css
│  │  ├─ components/       # AuthLayout, OtpInput
│  │  ├─ hooks/            # useLogin, useLogout
│  │  └─ pages/            # Login, Register, Forgot/Reset password
│  ├─ tickets/
│  │  ├─ hooks/            # useMyTickets, useCreateTicket
│  │  ├─ pages/            # HomePage, CreateTicket
│  │  └─ validations/
│  ├─ manager/
│  │  ├─ components/       # AssignmentPeopleFields, filters, table, pagination
│  │  ├─ hooks/            # useTickets, useAssignmentWorkspace, useSaveAssignment
│  │  ├─ pages/            # Tickets, AssignmentForm, Progress
│  │  └─ validations/
│  ├─ technician/
│  │  ├─ components/       # Appointment, Consultation
│  │  ├─ hooks/            # useAssignments, useAssignment
│  │  ├─ pages/            # Assignments, Assignment
│  │  └─ validations/
│  ├─ admin/
│  │  ├─ hooks/            # useAdminUsers
│  │  └─ pages/            # Users
│  └─ chat/
│     ├─ components/       # ChatBox
│     └─ hooks/            # useChatMessages
├─ styles/
│  ├─ global.css           # Reset, layout, buttons, theme entry point
│  ├─ root.css             # Light/dark design tokens
│  ├─ forms.css            # Inputs, textareas, form cards
│  ├─ components.css       # Shared page/card/ticket/picker styles
│  ├─ navbar.css
│  ├─ table.css
│  ├─ widget.css
│  ├─ chatbox.css
│  └─ admin.css
├─ App.jsx                 # Lazy-loaded route map
└─ main.jsx                # Router + AuthProvider bootstrap
```

### Layering rules

1. **Pages** compose hooks, UI and feature components. They do not call Axios
   directly.
2. **Feature hooks** own local state and call **services**.
3. **Services** own HTTP/socket details and are the only place that knows URLs.
4. **`lib/`** and **`constants/`** have no React dependency and can be reused
   anywhere.
5. **Shared UI** (`components/ui`) is presentation-only; **layout** knows about
   navigation and session state.

## Patterns applied

- **Provider + context hooks** — `AuthProvider` holds session state;
  `useAuth`, `useHasRole` and `ProtectedRoute` consume it. Splitting the context
  object (`authContext.js`), provider and hooks keeps React Fast Refresh happy.
- **Centralised API client** — one Axios instance applies the bearer token and
  handles `401`/`403`. `request()` unwraps responses and throws normalised
  errors, so feature hooks no longer repeat `try/catch` blocks.
- **Normalised errors** — `normalizeApiError()` flattens Laravel validation
  payloads (`message`, `errors.*`) into a predictable `{ message, status }`.
- **Generic async data hook** — `useAsyncData(loader, deps, fallback)` removes
  duplicated loading/error/cancellation logic.
- **Optimistic chat** — `useChatMessages` appends messages immediately, then
  reconciles them with the server/Reverb event, with de-duplication by id.
- **State keyed by resource** — chat history is keyed by ticket id, so
  switching tickets never shows stale messages; `AssignmentEditor` is keyed by
  ticket id so its form resets without effects.
- **Single source of truth for domain metadata** — status, priority and role
  labels/colours live in `constants/`; `TicketBadges` renders them consistently.
- **Layout + page-shell components** — `PageLoader` and `StatusPage` remove
  repeated loading/empty markup.
- **Lazy routes** — every page is loaded through `React.lazy` with one
  `Suspense` fallback, keeping the initial bundle smaller.

## What was merged, removed or reorganized

### Merged

| Before | After |
| --- | --- |
| `LeaderSelect`, `TechniciansSelect`, `SelectedTechnicians` | `manager/components/AssignmentPeopleFields.jsx` |
| `CreateAssigment`, `EditAssigment` pages | `manager/pages/AssignmentForm.jsx` (`mode="create" | "edit"`) |
| `useHandleSubmit`, `Usehandleedit` | `manager/hooks/useSaveAssignment.js` |
| Duplicated status/priority/role maps across pages | `constants/tickets.js`, `constants/users.js` |
| Repeated badge markup | `components/ui/TicketBadges.jsx` |
| Repeated loading/404/unauthorized markup | `components/ui/PageLoader.jsx`, `StatusPage.jsx` |

### Removed

- `src/assets/` (legacy styles and unused Vite logo).
- `src/features/default/` (replaced by `features/tickets/`).
- Admin `Dashboard.jsx` and `UserManagement.jsx` (unused/duplicate of `Users`).
- Old manager API/hooks/components/pages and the misspelled `assigment`
  validation.
- Old technician API, widget CSS, misspelled `Assigment.jsx` page and duplicate
  `useAssignment` hook.
- Old `components/ChatBox.jsx`, empty `components/widget.jsx`, fake
  `useChat`/`useDropdown` hooks and root `useLogout`.
- Old auth context/hooks (`context/AuthContext.jsx`, `useAuthContext`,
  `useForgettenPassword`, `api.js`, `login.css`).
- Legacy `services/api/{http,assigment,userApi}.js`, `utils/roles.js` and
  `styles/form.css`.
- Unused `bootstrap` and `react-bootstrap` dependencies.

### Reorganized

- `features/Technician/` → `features/technician/` (consistent casing, which
  also keeps Linux builds working).
- All raw HTTP calls moved into `services/api/*`; every page now goes through a
  feature hook.
- All session persistence moved into `lib/session.js`; it accepts the current
  `token` key and the legacy misspelled `tokken` key.
- All shared CSS consolidated under `src/styles/`; auth-only CSS stays in
  `features/auth/auth.css`.

## Technical debt eliminated

- 30+ obsolete files and two unused npm packages.
- Four duplicated `try/catch` HTTP patterns, replaced by `request()`.
- Inline `style={{ ... }}` layout blocks in the navbar, progress page,
  assignment pickers and chat UI, replaced by token-based CSS classes.
- Duplicate status/priority/role colour maps.
- Multiple copies of `.form-card`, `.input`, `.btn-danger` and status badge
  rules across CSS files.
- Stale imports, dead commented-out API code and unused exports.
- React lint violations: ref access during render (`OtpInput`) and an unstable
  `useMemo` dependency (`useTickets`).

## Validation

```bash
npm install   # removed 27 packages (Bootstrap + unused transitive deps)
npm run lint  # 0 problems
npm run build # successful production build
```

Baseline before the refactor: **23 lint problems (22 errors)**. Final state:
**0 problems** and a successful Vite build.

## Environment variables

Create a `.env.local` file to override the defaults in `src/config/env.js`:

```dotenv
VITE_API_BASE_URL=http://api:8000/api
VITE_REVERB_APP_KEY=ticketcenter-key
VITE_REVERB_HOST=striker67.duckdns.org
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## Remaining recommendations

1. **Add tests** — introduce Vitest + React Testing Library for hooks
   (`useChatMessages`, `useSaveAssignment`, `useAdminUsers`) and auth guards.
   There is currently no automated test suite.
2. **Server-side pagination/filtering** for `manager/ticket`; the UI currently
   filters the full list in memory.
3. **Share `useMyTickets`** through a small tickets context or cache. It is
   currently fetched independently by the navbar and home page.
4. **Split vendor chunks** — the main JS chunk is ~442 kB. Manual chunks for
   React, Font Awesome and Echo/Pusher would improve first load.
5. **Adopt TypeScript or PropTypes** — runtime shapes from the API (especially
   `assigments`, `interventions` and role payloads) are still implicit.
6. **Resolve `npm audit` findings** — 22 advisories remain in transitive
   dependencies; review them before the next release.
7. **Add CI** — run `npm ci`, `npm run lint` and `npm run build` on every pull
   request.
