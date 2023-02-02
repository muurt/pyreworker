import { logHandler } from "./logHandler";

// * Handles errors using the already configured logger.

export const errorHandler = (context: string, err: unknown): void => {
  const error = err as Error;
  logHandler.log("error", `There was an error in the ${context}:`);
  logHandler.log("error", `errorMessage: ${error.message}`);
  logHandler.log("error", `errorStack: ${error.stack}`);
};
