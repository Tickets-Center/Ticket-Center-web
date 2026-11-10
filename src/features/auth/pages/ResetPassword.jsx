import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../../../services/api/auth";
import { mapFieldErrors, validateResetPassword } from "../validation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const emailFromUrl = params.get("email") || "";

  const [form, setForm] = useState({
    email: emailFromUrl,
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateResetPassword(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!token) {
      setServerError(
        "Invalid or missing reset token. Please request a new link.",
      );
      return;
    }

    setIsLoading(true);
    setServerError("");
    try {
      await authApi.resetPassword({ token, ...form });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      if (err.errors) {
        setErrors(mapFieldErrors(err.errors));
      } else {
        setServerError(
          err.message || "Reset failed. The link may have expired.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout showLeft={false}>
        <div className="auth-success">
          <p className="error-message server-error">Invalid reset link.</p>
          <Link to="/forgot-password" className="auth-link">
            Request a new one
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout description="Choose a new secure password for your account.">
      <h2 className="auth-title">Reset Password</h2>

      {success ? (
        <div className="auth-success">
          <p>✓ Password updated! Redirecting to login…</p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <p className="error-message server-error">{serverError}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm new password"
            value={form.password_confirmation}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password_confirmation && (
            <p className="error-message">{errors.password_confirmation}</p>
          )}

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Updating…" : "Reset Password"}
          </button>

          <p className="auth-footer">
            <Link to="/login" className="auth-link">
              ← Back to Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
