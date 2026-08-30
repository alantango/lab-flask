import { validateEnv } from "./validate-env";

const { apiBaseUrl } = validateEnv(import.meta.env);

export const env = {
  apiBaseUrl,
} as const;
