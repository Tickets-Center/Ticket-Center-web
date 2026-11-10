import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import { authApi } from "../../../services/api/auth";
import { mapFieldErrors, validateRegisterForm } from "../validation";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");
    try {
      await authApi.register(form);
      setStep(2);
      setResendCooldown(60);
    } catch (err) {
      if (err.errors) {
        setErrors(mapFieldErrors(err.errors));
      } else {
        setServerError(err.message || "Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (otp.replace(/\s/g, "").length < 6) {
      setServerError("Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    setServerError("");
    try {
      await authApi.verifyEmail({
        email: form.email,
        code: otp.replace(/\s/g, ""),
      });
      setSuccessMsg("Email verified! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerError(err.message || "Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setServerError("");
    try {
      await authApi.resendVerification(form.email);
      setResendCooldown(60);
      setSuccessMsg("A new code has been sent.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setServerError(err.message || "Could not resend.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <AuthLayout description="Check your inbox for the 6-digit code.">
        <h2 className="auth-title">Verify your email</h2>
        <p className="auth-subtitle">
          We sent a code to <strong>{form.email}</strong>
        </p>

        {serverError && (
          <p className="error-message server-error">{serverError}</p>
        )}
        {successMsg && <p className="auth-success-text">{successMsg}</p>}

        <form className="auth-form" onSubmit={handleVerify} noValidate>
          <OtpInput value={otp} onChange={setOtp} />

          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Verifying…" : "Verify Email"}
          </button>

          <div className="auth-footer">
            <span>Didn&apos;t receive it? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className="link-button"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend code"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="link-button muted"
          >
            ← Go back
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout description="Create an account to report and track your issues.">
      {serverError && (
        <p className="error-message server-error">{serverError}</p>
      )}

      <form className="auth-form" onSubmit={handleRegister} noValidate>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "input-error" : ""}
          disabled={isLoading}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          disabled={isLoading}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
          disabled={isLoading}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm password"
          value={form.password_confirmation}
          onChange={handleChange}
          className={errors.password_confirmation ? "input-error" : ""}
          disabled={isLoading}
        />
        {errors.password_confirmation && (
          <p className="error-message">{errors.password_confirmation}</p>
        )}

        <button className="login-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create Account"}
        </button>

        <hr />

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
