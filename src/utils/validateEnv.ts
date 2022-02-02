import { logHandler } from "./logHandler";

/*
 * ➞ ErrorHandler.ts
 * Handles the errors and prevents them from stopping the bot
 * Also pushes them towards sentry
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

  if (!process.env.sentryDsn) {
    logHandler.log("warn", "Missing environment variable | sentryDsn");
    process.exit(1);
  }
};
