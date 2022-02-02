import * as sentry from "@sentry/node";
import { logHandler } from "./logHandler";

/*
 * ➞ ErrorHandler.ts
 * Handles the errors and prevents them from stopping the bot
 * Also pushes them towards sentry
 */

/*
 * ➞ errorHandler
 * ➞ context | The context the error happend at
 * ➞ err | The error to handle
 * ➞ Return type | Void
 * Logs the error to the console and pushes it towards sentry
 */

export const errorHandler = (context: string, err: unknown): void => {
  const error = err as Error;
  logHandler.log("error", `There was an error in the ${context}:`);
  logHandler.log(
    "error",
    JSON.stringify({ errorMessage: error.message, errorStack: error.stack })
  );
  // ? Should sentry be disabled until beta/we get a stable hosting?
  sentry.captureException(error);
};
