import { logHandler } from "./logHandler";

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
