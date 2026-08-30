
export function validateEnv(values: Record<string, string | undefined>) {
  const apiBaseUrl = values.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  try {
    new URL(apiBaseUrl);
  } catch {
    throw new Error("VITE_API_BASE_URL must be a valid URL");
  }

  // add validation for other env variables here

  return { apiBaseUrl };
}