import { logHandler } from "./logHandler";

// * Handles errors using the already configured logger.

export const errorHandler = (context: string, err: unknown): void => {
  const error = err as Error;
  logHandler.info(`error | There was an error in the ${context}:`);
  logHandler.info(`error | errorMessage: ${error.message}`);
  logHandler.info(`error | errorStack: ${error.stack}`);
};
