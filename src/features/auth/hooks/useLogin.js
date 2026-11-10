import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../services/api/auth";
import { validateLoginForm } from "../validation";
import { useAuth } from "../useAuth";

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const data = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      login(data);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    formData,
    errors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  };
}
