// Normalises the many error shapes produced by the API into one predictable
// object: { message, status, errors?, ...originalPayload }.
export function normalizeApiError(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (data && typeof data === "object") {
    const firstFieldError =
      data.errors && Object.values(data.errors).find(Boolean)?.[0];

    return {
      ...data,
      status,
      message: data.message || firstFieldError || fallback,
    };
  }

  return {
    status,
    message: typeof data === "string" ? data : error?.message || fallback,
  };
}
