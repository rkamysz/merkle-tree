/**
 * Validates the presence of required environment variables.
 *
 * This function checks if the following environment variables are defined:
 * - ACCESS_KEY
 * - SECRET_ACCESS_KEY
 * - REGION
 *
 * If any of these variables are missing, it throws an error indicating the missing variables.
 *
 * @throws {Error} If any required environment variables are missing.
 */
export const validateEnvVariables = () => {
  const requiredEnvVariables = ["ACCESS_KEY", "SECRET_ACCESS_KEY", "REGION"];

  const missingVariables: string[] = [];

  for (const envVar of requiredEnvVariables) {
    if (!process.env[envVar]) {
      missingVariables.push(envVar);
    }
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
};
