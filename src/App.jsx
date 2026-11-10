import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "./components/ui/PageLoader";
import StatusPage from "./components/ui/StatusPage";
import ProtectedRoute from "./features/auth/ProtectedRoute";

const LoginPage = lazy(() => import("./features/auth/pages/Login"));
const RegisterPage = lazy(() => import("./features/auth/pages/Register"));
const ForgotPasswordPage = lazy(
  () => import("./features/auth/pages/ForgotPassword"),
);
const ResetPasswordPage = lazy(
  () => import("./features/auth/pages/ResetPassword"),
);

const HomePage = lazy(() => import("./features/tickets/pages/HomePage"));
const CreateTicket = lazy(() => import("./features/tickets/pages/CreateTicket"));

const Ticket = lazy(() => import("./features/manager/pages/Tickets"));
const AssignmentForm = lazy(
  () => import("./features/manager/pages/AssignmentForm"),
);
const Progress = lazy(() => import("./features/manager/pages/Progress"));

const Assignments = lazy(
  () => import("./features/technician/pages/Assignments"),
);
const Assignment = lazy(() => import("./features/technician/pages/Assignment"));

const AdminUsers = lazy(() => import("./features/admin/pages/Users"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/404"
          element={<StatusPage title="404" message="Page not found." />}
        />
        <Route
          path="/unauthorized"
          element={
            <StatusPage
              title="Unauthorized"
              message="You are not authorized to access this page."
            />
          }
        />

        {/* Any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/createTicket" element={<CreateTicket />} />
        </Route>

        {/* Technician + Admin */}
        <Route element={<ProtectedRoute roles={["technician", "admin"]} />}>
          <Route path="/technician/assignments" element={<Assignments />} />
          <Route path="/technician/assignment/:id" element={<Assignment />} />
        </Route>

        {/* Manager / Dispatcher / Admin */}
        <Route
          element={<ProtectedRoute roles={["manager", "dispatcher", "admin"]} />}
        >
          <Route path="/manager/tickets" element={<Ticket />} />
          <Route
            path="/assign/edit/:id"
            element={<AssignmentForm mode="edit" />}
          />
          <Route path="/assign/:id" element={<AssignmentForm mode="create" />} />
          <Route path="/progress/:id" element={<Progress />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
