import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../../../services/api/tickets";
import { validateTicketForm } from "../validations/ticket";

const INITIAL_FORM = { description: "" };

export function useCreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
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

    const validationErrors = validateTicketForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      await ticketsApi.create({ description: formData.description });
      setFormData(INITIAL_FORM);
      navigate("/");
    } catch (err) {
      setServerError(
        err.message || "Failed to create ticket. Please try again.",
      );
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
