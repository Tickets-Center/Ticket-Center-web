export function validateAppointment({ datetime }) {
  const errors = {};

  if (!datetime || !datetime.trim()) {
    errors.datetime = "Please select a date and time.";
    return errors;
  }

  const appointmentDate = new Date(datetime);
  if (Number.isNaN(appointmentDate.getTime())) {
    errors.datetime = "Invalid date format.";
  } else if (appointmentDate < new Date()) {
    errors.datetime = "Appointment must be in the future.";
  }

  return errors;
}
