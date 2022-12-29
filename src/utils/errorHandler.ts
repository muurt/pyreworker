import { logHandler } from "./logHandler";

export const errorHandler = (context: string, err: unknown): void => {
  const error = err as Error;
  logHandler.log("error", `There was an error in the ${context}:`);
  logHandler.log("error", `errorMessage: ${error.message}`);
  logHandler.log("error", `errorStack: ${error.stack}`);
};
