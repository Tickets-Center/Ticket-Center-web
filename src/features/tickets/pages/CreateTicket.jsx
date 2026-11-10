import { useEffect, useRef } from "react";
import Navbar from "../../../components/layout/Navbar";
import { useCreateTicket } from "../hooks/useCreateTicket";

export default function CreateTicket() {
  const textareaRef = useRef(null);
  const {
    formData,
    errors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useCreateTicket();

  // Keep the textarea sized to its content.
  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [formData.description]);

  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1 className="page-title">Create Ticket</h1>

        <form className="ticket-form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <p className="error-message server-error">{serverError}</p>
          )}

          <div>
            <textarea
              ref={textareaRef}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your problem..."
              disabled={isLoading}
              className={`textarea ${errors.description ? "input-error" : ""}`}
            />
            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </>
  );
}
