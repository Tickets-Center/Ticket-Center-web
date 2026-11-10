import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const {
    formData,
    errors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <AuthLayout description="ticket center helps you report your problems.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {serverError && (
          <p className="error-message server-error">{serverError}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          disabled={isLoading}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
          disabled={isLoading}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <button className="login-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <Link to="/forgot-password" className="forgot">
          Forgotten password?
        </Link>

        <hr />

        <Link to="/register" className="signup-btn">
          Create New Account
        </Link>
      </form>
    </AuthLayout>
  );
}
