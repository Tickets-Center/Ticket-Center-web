export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function mapFieldErrors(errors = {}) {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, messages[0]]),
  );
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test((value || "").trim());
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email || email.trim() === "") {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password || password.trim() === "") {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function validateRegisterForm({
  name,
  email,
  password,
  password_confirmation,
}) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  } else if (name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (password !== password_confirmation) {
    errors.password_confirmation = "Passwords do not match.";
  }

  return errors;
}

export function validateResetPassword({
  email,
  password,
  password_confirmation,
}) {
  const errors = {};

  if (!email.trim()) errors.email = "Email is required.";

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Minimum 6 characters.";
  }

  if (password !== password_confirmation) {
    errors.password_confirmation = "Passwords do not match.";
  }

  return errors;
}
