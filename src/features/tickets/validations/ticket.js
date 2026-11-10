export function validateTicketForm({ description }) {
  const errors = {};

  if (!description || description.trim() === "") {
    errors.description = "Description is required.";
  } else if (description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  return errors;
}
