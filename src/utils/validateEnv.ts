import { logHandler } from "./logHandler";

const missingBotTokenError = "Missing environment variable | botToken";
const missingMongoUriError = "Missing environment variable | mongoUri";

// * Check ENV variables.

export const validateEnv = (): void => {
  if (!process.env.botToken) {
    logHandler.log("warn", missingBotTokenError);
    process.exit(1);
  }

  if (!process.env.mongoUri) {
    logHandler.log("warn", missingMongoUriError);
    process.exit(1);
  }
};
