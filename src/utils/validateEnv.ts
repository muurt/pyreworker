import { logHandler } from "./logHandler";

const missingBotTokenError = "Missing environment variable | botToken";
const missingChannelIdError = "Missing environment variable | logChannelId";
const missingMongoUriError = "Missing environment variable | mongoUri";

// * Check ENV variables.

export const validateEnv = (): void => {
  if (!process.env.botToken) {
    logHandler.info(`warn | ${missingBotTokenError}`);
    process.exit(1);
  }

  if (!process.env.logChannelId) {
    logHandler.info(`warn | ${missingChannelIdError}`);
    process.exit(1);
  }

  if (!process.env.mongoUri) {
    logHandler.info(`warn | ${missingMongoUriError}`);
    process.exit(1);
  }
};
