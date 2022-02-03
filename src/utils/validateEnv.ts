import { logHandler } from "./logHandler";

/*
 * ➞ ValidateEnv.ts
 * Checks on the ENV variables
 */

/*
 * ➞ validateEnv
 * ➞ Return type | Void
 * Checks if all the required env variables exist, and if they don't
 * it quits the process
 */

export const validateEnv = (): void => {
  if (!process.env.botToken) {
    logHandler.log("warn", "Missing environment variable | botToken");
    process.exit(1);
  }

  if (!process.env.mongoUri) {
    logHandler.log("warn", "Missing environment variable | mongoUri");
    process.exit(1);
  }
};
