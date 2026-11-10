import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../../../services/api/auth";
import { isValidEmail } from "../validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess(
        "If that email exists in our system, a reset link has been sent. Check your inbox.",
      );
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout description="We'll send you a secure link to reset your password.">
      <h2 className="auth-title">Forgot Password</h2>
      <p className="auth-subtitle">
        Enter your account email and we&apos;ll send a reset link.
      </p>

      {error && <p className="error-message server-error">{error}</p>}

      {success ? (
        <div className="auth-success">
          <p>✓ {success}</p>
          <Link to="/login" className="auth-link">
            ← Back to Login
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            disabled={isLoading}
          />

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Sending…" : "Send Reset Link"}
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
